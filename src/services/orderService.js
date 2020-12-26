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

const GetAllOrders = (restaurantUuid, consumerUuid /* , { scope, start, length } */) => new Promise(async (resolve, reject) => {
  try {
    const order = await db.Order.findAll({
      order: [
        ['createdAt', 'DESC'],
      ],
      where: {
        [Op.or]: [
          restaurantUuid && { restaurantUuid: restaurantUuid || null },
          consumerUuid && { consumerUuid: consumerUuid || null },
        ],
      },
    }).then(async (entities) => {
      if (!entities) {
        return entities;
      }

      await Promise.all(entities.map(async (entity) => {
        const items = await entity.getItems();
        // entity.Items = items;
        // entity.dataValues.Items = items;

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

const CreateOrder = (_restaurantUuid, consumerUuid, { restaurantUuid, tableUuid, items }) => new Promise(async (resolve, reject) => {
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
          no: 0,
          restaurantUuid: resUuid,
          tableUuid,
          consumerUuid,
        }, {
          transaction,
        });

        if (!tempOrder) {
          return reject(constants.errors.UNKNOWN);
        }

        // add each item to the order thorugh orderItems
        const orderItems = items.map(item => {
          if (item && item.uuid && item.quantity) {
            return {
              orderUuid: tempOrder.uuid,
              itemUuid: item.uuid,
              options: (item.options && item.options.join(";")) || "",
              quantity: item.quantity,
            }
          }
        });

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

      const orderInfo = GetOrderInfo(order.dataValues.uuid, restaurantUuid, consumerUuid);
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

const UpdateOrder = (/* uuid, restaurantUuid, consumerUuid, { tableUuid, items } */) => {

};

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
