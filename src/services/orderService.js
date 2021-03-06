// import validator from 'validator';
import { Op } from 'sequelize';
import { v4 as _uuid } from 'uuid';

import ConsumerService from './consumerService';

import { db } from '../lib/clients';
import constants from '../lib/constants';

const GetOrderInfo = (uuid, restaurantUuid, consumerUuid) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const order = await db.Order.findOne({
      include: {
        model: db.Restaurant,
        attributes: [
          'uuid',
          'name',
          'serviceType',
          'img',
        ],
      },
      where: {
        uuid,
        [Op.or]: [
          restaurantUuid && { restaurantUuid: restaurantUuid || null },
          consumerUuid && { consumerUuid: consumerUuid || null },
        ],
      },
    }).then(async (entity) => {
      if (!entity) {
        return entity;
      }

      const items = await entity.getItems();
      entity.Items = items;
      entity.dataValues.Items = items;

      entity.totalPrice = 0;
      entity.dataValues.totalPrice = 0;
      await Promise.all(items.map((item) => {
        entity.totalPrice += item.price * item.OrderItems.quantity;
        entity.dataValues.totalPrice += item.price * item.OrderItems.quantity;
        return item;
      }));

      return entity;
    });

    if (!order) {
      return reject(constants.errors.ENTITY_NOT_EXIST);
    }

    return resolve(order);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const GetAllOrders = (restaurantUuid, consumerUuid, { scope = 'all' /* start, length */ }) => new Promise(async (resolve, reject) => {
  try {
    const scopeArr = [
      ((scope === 'all' || scope === 'waiting') && 'waiting') || null,
      ((scope === 'all' || scope === 'served') && 'served') || null,
      ((scope === 'all' || scope === 'paid') && 'paid') || null,
    ];

    const order = await db.Order.findAll({
      include: {
        model: db.Restaurant,
        attributes: [
          'uuid',
          'name',
          'serviceType',
          'img',
        ],
      },
      order: [
        ['status', 'DESC'],
        ['updatedAt', 'DESC'],
      ],
      where: {
        [Op.or]: [
          restaurantUuid && { restaurantUuid: restaurantUuid || null },
          consumerUuid && { consumerUuid: consumerUuid || null },
        ],
        status: scopeArr,
      },
    }).then(async (entities) => {
      if (!entities) {
        return entities;
      }

      await Promise.all(entities.map(async (entity) => {
        const items = await entity.getItems();
        entity.Items = items;
        entity.dataValues.Items = items;

        entity.totalPrice = 0;
        entity.dataValues.totalPrice = 0;
        await Promise.all(items.map((item) => {
          entity.totalPrice += item.price * item.OrderItems.quantity;
          entity.dataValues.totalPrice += item.price * item.OrderItems.quantity;
          return item;
        }));

        return entity;
      }));

      return entities;
    });

    return resolve(order);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const CreateOrder = (_restaurantUuid, consumerUuid, {
  restaurantUuid, tableUuid, items, deviceId,
}) => new Promise(async (resolve, reject) => {
  try {
    if (!items) {
      return reject(constants.errors.MISSING_ARGS);
    }

    // check user has active order
    if (consumerUuid) {
      const consumer = await ConsumerService.GetConsumerInfo(consumerUuid);

      if (!consumer) {
        return reject(constants.errors.ENTITY_NOT_EXIST);
      }

      if (consumer.Orders && consumer.Orders.length > 0) {
        return reject(constants.errors.CONSUMER_HAS_ALREADY_ORDER);
      }
    }

    // get restaurant
    const resUuid = _restaurantUuid || restaurantUuid;

    if (!resUuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const restaurant = await db.Restaurant.findByPk(resUuid, {
      attributes: ['serviceType'],
    });

    if (!restaurant) {
      return reject(constants.errors.ENTITY_NOT_EXIST);
    }

    // check table uuid when restaurant service type is normal
    if (restaurant.serviceType === constants.SERVICE_TYPES.NORMAL && !tableUuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    // check table is exists
    if (restaurant.serviceType === constants.SERVICE_TYPES.NORMAL && tableUuid) {
      const table = await db.Table.findOne({
        where: {
          uuid: tableUuid,
          restaurantUuid: resUuid,
        },
      });

      if (!table) {
        return reject(constants.errors.ENTITY_NOT_EXIST);
      }
    } else {
      tableUuid = null;
    }

    // create order
    try {
      const order = await db.sequelize.transaction(async (transaction) => {
        const tempOrder = await db.Order.create({
          uuid: _uuid(),
          restaurantUuid: resUuid,
          tableUuid,
          consumerUuid,
          deviceId,
        }, {
          transaction,
        });

        if (!tempOrder) {
          return reject(constants.errors.UNKNOWN);
        }

        // add each item to the order thorugh orderItems
        const orderItems = items
          .filter((item) => (item && item.uuid && item.quantity))
          .map((item) => ({
            orderUuid: tempOrder.uuid,
            itemUuid: item.uuid,
            options: (item.options && item.options.join(';')) || '',
            quantity: item.quantity,
          }));

        if (!orderItems || orderItems.length === 0) {
          throw constants.errors.INVALID_ARGS;
        }

        await db.OrderItems.bulkCreate(orderItems, { transaction });

        if (tableUuid) {
          const table = await db.Table.findOne({
            where: {
              uuid: tableUuid,
              restaurantUuid: resUuid,
            },
          }, {
            transaction,
          });

          await table.update({
            status: 'occupied',
          }, {
            transaction,
          });
        }

        return tempOrder;
      });

      const orderInfo = await GetOrderInfo(order.dataValues.uuid, restaurantUuid, consumerUuid);
      return resolve(orderInfo);
    } catch (err) {
      return reject(err);
    }
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const UpdateOrder = (uuid, restaurantUuid, consumerUuid, {
  status, tableUuid, items, deviceId,
}) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    if (status && !constants.ORDER_STATUS.includes(status)) {
      return reject(constants.errors.INVALID_ARGS);
    }

    if (restaurantUuid) {
      const restaurant = await db.Restaurant.findByPk(restaurantUuid, {
        attributes: ['serviceType'],
      });

      if (restaurant.serviceType === constants.SERVICE_TYPES.SELF) {
        tableUuid = null;
      }
    }

    if (consumerUuid && tableUuid) {
      status = undefined;
      tableUuid = undefined;
    }

    try {
      await db.sequelize.transaction(async (transaction) => {
        const tempOrder = await GetOrderInfo(uuid, restaurantUuid, consumerUuid);

        if (tempOrder.status === 'paid') {
          throw constants.errors.ORDER_HAVE_ALREADY_PAID;
        }

        if (tableUuid) {
          const table = await db.Table.findOne({
            where: {
              uuid: tableUuid,
              restaurantUuid,
            },
          }, {
            transaction,
          });

          await table.update({
            status: 'occupied',
          }, {
            transaction,
          });

          const tempTable = await db.Table.findOne({
            include: {
              model: db.Order,
              where: {
                status: {
                  [Op.ne]: 'paid',
                },
              },
              required: false,
            },
            order: [
              ['name', 'ASC'],
            ],
            where: {
              uuid: tempOrder.tableUuid,
              restaurantUuid,
            },
          }, {
            transaction,
          });

          const leftOrders = tempTable.Orders.filter((order) => order.uuid !== uuid);

          if (leftOrders.length === 0) {
            await tempTable.update({
              services: null,
              status: null,
            }, {
              transaction,
            });
          }
        }

        await tempOrder.update({
          status,
          tableUuid,
          deviceId,
        }, {
          transaction,
        });

        if (!items || items.length === 0) {
          return tempOrder;
        }

        // convert filter items
        const orderItems = await items
          .filter((item) => (item && item.uuid && item.quantity))
          .map((item) => ({
            orderUuid: tempOrder.uuid,
            itemUuid: item.uuid,
            options: (item.options && item.options.join(';')) || '',
            quantity: item.quantity,
          }));

        if (!orderItems || orderItems.length === 0) {
          throw constants.errors.INVALID_ARGS;
        }

        const upsertOrderItem = async (orderItem) => {
          const tempItem = await db.OrderItems.findOne({
            transaction,
            where: {
              orderUuid: orderItem.orderUuid,
              itemUuid: orderItem.itemUuid,
              options: orderItem.options,
            },
          });

          if (!tempItem) {
            return orderItem;
          }

          if (tempItem.quantity + orderItem.quantity <= 0) {
            await db.OrderItems.destroy({
              transaction,
              where: {
                orderUuid: orderItem.orderUuid,
                itemUuid: orderItem.itemUuid,
                options: orderItem.options,
              },
            });

            return null;
          }

          await db.OrderItems.increment('quantity', {
            by: orderItem.quantity,
            transaction,
            where: {
              orderUuid: orderItem.orderUuid,
              itemUuid: orderItem.itemUuid,
              options: orderItem.options,
            },
          });
          return null;
        };

        const bulkItems = (await Promise.all(
          orderItems.map(async (orderItem) => upsertOrderItem(orderItem)),
        )
        ).filter((i) => i);

        await db.OrderItems.bulkCreate(bulkItems, { transaction });
        await tempOrder.update({
          status: 'waiting',
        }, { transaction });

        return tempOrder;
      });

      const orderInfo = await GetOrderInfo(uuid, restaurantUuid, consumerUuid);
      return resolve(orderInfo);
    } catch (err) {
      return reject(err);
    }
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const DeleteOrder = (uuid, restaurantUuid, consumerUuid) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const order = await db.Order.findOne({
      where: {
        uuid,
        [Op.or]: [
          restaurantUuid && { restaurantUuid: restaurantUuid || null },
          consumerUuid && { consumerUuid: consumerUuid || null },
        ],
      },
    });

    if (order) {
      await order.destroy();
    } else {
      return reject(constants.errors.ENTITY_NOT_EXIST);
    }

    return resolve();
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const PayOrder = (uuid, restaurantUuid, consumerUuid, { token }) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    try {
      const order = await db.sequelize.transaction(async (transaction) => {
        const orderEntity = await GetOrderInfo(uuid, restaurantUuid, consumerUuid);

        if (orderEntity.status === 'paid') {
          throw constants.errors.ORDER_HAVE_ALREADY_PAID;
        }

        // todo: if restaurant type is not self, then update as paid
        await orderEntity.update({
          status: 'paid',
        }, {
          transaction,
        });

        // Decrease consumer balance
        if (consumerUuid && !token) {
          const consumer = await ConsumerService.GetConsumerInfo(consumerUuid);
          const { totalPrice } = orderEntity;

          if (consumer.balance < totalPrice) {
            throw constants.errors.CONSUMER_INSUFFICIENT_BALANCE;
          }

          consumer.decrement('balance', { by: totalPrice });
        }

        return orderEntity;
      });

      // unoccupy table if there is no active order
      const { tableUuid } = order;
      if (tableUuid) {
        const table = await db.Table.findByPk(tableUuid, {
          include: {
            model: db.Order,
            where: {
              status: {
                [Op.ne]: 'paid',
              },
            },
            required: false,
          },
        });

        if (table && table.Orders && table.Orders.length === 0) {
          await table.update({
            status: null,
            services: null,
          });
        }
      }

      return resolve(order);
    } catch (err) {
      return reject(err);
    }
  } catch (err) {
    if (err && err.code) {
      return reject(err);
    }

    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

export default {
  GetOrderInfo,
  GetAllOrders,
  CreateOrder,
  UpdateOrder,
  DeleteOrder,
  PayOrder,
};
