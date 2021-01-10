import validator from 'validator';
import { Op } from 'sequelize';
import { v4 as _uuid } from 'uuid';
import moment from 'moment';

import { db } from '../lib/clients';
import constants from '../lib/constants';

/**
 * Restaurant Info Operations
 */
const GetRestaurantInfo = (uuid, consumerUuid = null) => new Promise(async (resolve, reject) => {
  try {
    const restaurant = await db.Restaurant.findByPk(uuid).then(async (entity) => {
      delete entity.password;
      delete entity.dataValues.password;

      if (!consumerUuid) {
        return entity;
      }

      entity.favourite = false;
      entity.dataValues.favourite = false;

      const isFavouriteRestaurant = await db.ConsumerFavouriteRestaurants.findOne({
        where: {
          consumerUuid,
          restaurantUuid: uuid,
        },
      });

      if (isFavouriteRestaurant) {
        entity.favourite = true;
        entity.dataValues.favourite = true;
      }

      return entity;
    });
    return resolve(restaurant);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const UpdateRestaurantInfo = (uuid, {
  name, address, email, phoneNumber, serviceType, img, username, password,
}) => new Promise(async (resolve, reject) => {
  if (name === '' || address === '' || email === '' || phoneNumber === '' || serviceType === '' || username === '' || password === '') {
    return reject(constants.errors.VALIDATOR_ARGS);
  }

  const isServiceTypeValid = serviceType
    && (constants.SERVICE_TYPES[serviceType.toUpperCase()] != null);

  if (serviceType && !isServiceTypeValid) {
    return reject(constants.errors.INVALID_ARGS);
  }

  if (email && !validator.isEmail(email)) {
    return reject(constants.errors.VALIDATOR_ARGS);
  }

  const isExist = await db.Restaurant.findOne({
    where: {
      [Op.or]: [
        { username: username || null },
        { email: email || null },
        { phoneNumber: phoneNumber || null },
      ],
    },
  });

  if (isExist) {
    return reject(constants.errors.DUPLICATED_ARGS);
  }

  try {
    const restaurant = await db.Restaurant.update({
      name,
      address,
      email,
      phoneNumber,
      serviceType,
      img,
      username,
      password,
    }, {
      where: {
        uuid,
      },
    });

    return resolve(restaurant);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

/**
 * Menu Operations
 */
const GetRestaurantMenu = (restaurantUuid) => new Promise(async (resolve, reject) => {
  try {
    const items = await db.Item.findAll({
      order: [
        ['type', 'ASC'],
        ['name', 'ASC'],
      ],
      where: {
        restaurantUuid,
      },
    });

    const catalog = [];
    const catalogWithItems = {};

    items.map((item) => {
      if (!catalog.includes(item.type)) {
        catalog.push(item.type);
        catalogWithItems[item.type] = [];
      }

      catalogWithItems[item.type].push(item);
      return item;
    });

    const Menu = {
      catalog,
      items: catalogWithItems,
    };

    return resolve(Menu);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

/**
 * Table Operations
 */
const GetRestaurantTable = (uuid, restaurantUuid) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const table = await db.Table.findOne({
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
        uuid,
        restaurantUuid,
      },
    }).then((entity) => {
      if (!entity) {
        return entity;
      }

      // convert services
      if (entity.services) {
        entity.services = JSON.parse(entity.services);

        // calculate most delated date
        if (entity.services) {
          entity.services.map((service) => {
            if (entity.dataValues.mostDelayedDate) {
              const tempDate = new Date(service.createdAt);
              if (tempDate - entity.dataValues.mostDelayedDate < 0) {
                entity.dataValues.mostDelayedDate = tempDate;
                entity.mostDelayedDate = tempDate;
              }
            } else {
              entity.dataValues.mostDelayedDate = new Date(service.createdAt);
              entity.mostDelayedDate = new Date(service.createdAt);
            }

            return service;
          });
        }
      }

      if (entity.Orders) {
        entity.Orders.map(async (order) => {
          // calculate most delated date
          if (order.status !== 'served') {
            if (entity.dataValues.mostDelayedDate) {
              const tempDate = new Date(order.createdAt);
              if (tempDate - entity.dataValues.mostDelayedDate < 0) {
                entity.dataValues.mostDelayedDate = tempDate;
                entity.mostDelayedDate = tempDate;
              }
            } else {
              entity.dataValues.mostDelayedDate = new Date(order.createdAt);
              entity.mostDelayedDate = new Date(order.createdAt);
            }
          }

          return order;
        });
      }

      return entity;
    });

    if (!table) {
      return reject(constants.errors.ENTITY_NOT_EXIST);
    }

    return resolve(table);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const GetRestaurantTables = (restaurantUuid) => new Promise(async (resolve, reject) => {
  try {
    const tables = await db.Table.findAll({
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
        restaurantUuid,
      },
    }).then((entities) => {
      if (!entities) {
        return entities;
      }

      entities.map((entity) => {
        // convert services
        if (entity.services) {
          entity.services = JSON.parse(entity.services);

          // calculate most delated date
          if (entity.services) {
            entity.services.map((service) => {
              if (entity.dataValues.mostDelayedDate) {
                const tempDate = new Date(service.createdAt);
                if (tempDate - entity.dataValues.mostDelayedDate < 0) {
                  entity.dataValues.mostDelayedDate = tempDate;
                  entity.mostDelayedDate = tempDate;
                }
              } else {
                entity.dataValues.mostDelayedDate = new Date(service.createdAt);
                entity.mostDelayedDate = new Date(service.createdAt);
              }

              return service;
            });
          }
        }

        if (entity.Orders) {
          entity.Orders.map(async (order) => {
            // calculate most delated date
            if (order.status !== 'served') {
              if (entity.dataValues.mostDelayedDate) {
                const tempDate = new Date(order.createdAt);
                if (tempDate - entity.dataValues.mostDelayedDate < 0) {
                  entity.dataValues.mostDelayedDate = tempDate;
                  entity.mostDelayedDate = tempDate;
                }
              } else {
                entity.dataValues.mostDelayedDate = new Date(order.createdAt);
                entity.mostDelayedDate = new Date(order.createdAt);
              }
            }

            return order;
          });
        }

        return entity;
      });

      return entities;
    });

    return resolve(tables);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const CreateRestaurantTable = (restaurantUuid, { name }) => new Promise(async (resolve, reject) => {
  try {
    if (!name) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const table = await db.Table.create({
      uuid: _uuid(),
      name,
      restaurantUuid,
    });

    return resolve(table);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const UpdateRestaurantTable = (uuid, restaurantUuid, { name, status }) => new Promise(async (resolve, reject) => {
  try {
    if (!name && !status) {
      return reject(constants.errors.MISSING_ARGS);
    }

    if (status && !constants.TABLE_STATUS.includes(status)) {
      return reject(constants.errors.INVALID_ARGS);
    }

    const table = await db.Table.findOne({
      where: {
        uuid,
        restaurantUuid,
      },
    });

    if (!table) {
      return reject(constants.errors.ENTITY_NOT_EXIST);
    }

    await table.update({
      name,
      status,
    });

    const updatedTable = await GetRestaurantTable(uuid, restaurantUuid);
    return resolve(updatedTable);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const DeleteRestaurantTable = (uuid, restaurantUuid) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const table = await db.Table.findOne({
      where: {
        uuid,
        restaurantUuid,
      },
    });

    if (table) {
      await table.destroy();
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

const AddRestaurantTableService = (uuid, restaurantUuid, { name }) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid || !name) {
      return reject(constants.errors.MISSING_ARGS);
    }

    if (!constants.RESTAURANT_SERVICES.includes(name)) {
      return reject(constants.errors.INVALID_ARGS);
    }

    const table = await db.Table.findOne({
      where: {
        uuid,
        restaurantUuid,
      },
    });

    if (!table) {
      return reject(constants.errors.ENTITY_NOT_EXIST);
    }

    const services = table.services ? JSON.parse(table.services) : [];

    const isServiceExist = services.filter((service) => (service.name === name));

    if (isServiceExist.length > 0) {
      return reject(constants.errors.DUPLICATED_ARGS);
    }

    services.push({
      name,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    });

    await table.update({
      services: JSON.stringify(services),
    });

    const updatedTable = await GetRestaurantTable(uuid, restaurantUuid);
    return resolve(updatedTable);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const DeleteRestaurantTableService = (uuid, restaurantUuid, { name }) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid || !name) {
      return reject(constants.errors.MISSING_ARGS);
    }

    if (!constants.RESTAURANT_SERVICES.includes(name)) {
      return reject(constants.errors.INVALID_ARGS);
    }

    const table = await db.Table.findOne({
      where: {
        uuid,
        restaurantUuid,
      },
    });

    if (!table) {
      return reject(constants.errors.ENTITY_NOT_EXIST);
    }

    const services = table.services ? JSON.parse(table.services) : [];

    const filteredServices = services.filter((service) => (service.name !== name));

    await table.update({
      services: filteredServices.length > 0 ? JSON.stringify(filteredServices) : null,
    });

    const updatedTable = await GetRestaurantTable(uuid, restaurantUuid);
    return resolve(updatedTable);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

/**
 * Item Operations
 */
const GetRestaurantItem = (uuid, restaurantUuid) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const item = await db.Item.findOne({
      where: {
        uuid,
        restaurantUuid,
      },
    });

    if (!item) {
      return reject(constants.errors.ENTITY_NOT_EXIST);
    }

    if (item.dataValues.options) {
      item.dataValues.options = item.options.split(';');
    }

    return resolve(item && item.dataValues);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const CreateRestaurantItem = (restaurantUuid, {
  name, desc, type, options, price, img, enabled,
}) => new Promise(async (resolve, reject) => {
  try {
    if (!name || !type || !price) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const item = await db.Item.create({
      uuid: _uuid(),
      name,
      desc,
      type,
      options: (options && options.join(';')) || null,
      price,
      img,
      enabled,
      restaurantUuid,
    });
    return resolve(item.dataValues);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const UpdateRestaurantItem = (uuid, restaurantUuid, {
  name, desc, type, options, price, img, enabled,
}) => new Promise(async (resolve, reject) => {
  try {
    if (name === '' || desc === '' || type === '' || options === '' || price === '' || enabled === '') {
      return reject(constants.errors.INVALID_ARGS);
    }

    const item = await db.Item.update({
      name,
      desc,
      type,
      options: (options && options.join(';')) || undefined,
      price,
      img,
      enabled,
    }, {
      where: {
        uuid,
        restaurantUuid,
      },
    });
    return resolve(item);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const DeleteRestaurantItem = (uuid, restaurantUuid) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const item = await db.Item.findOne({
      where: {
        uuid,
        restaurantUuid,
      },
    });

    if (item) {
      await item.destroy();
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

/**
 * Metric Operations
 */
const GetRestaurantMetrics = (uuid) => new Promise(async (resolve, reject) => {
  try {
    const tables = await GetRestaurantTables(uuid);
    const tableOrders = tables.map((table) => table.Orders);

    const services = tables.filter((table) => (table.services)).map((table) => (table.services.map((service) => service.name)));
    const filterService = (serviceName) => services
      .map((serviceArr) => serviceArr.filter((service) => (service === serviceName)))
      .filter((serviceArr) => (serviceArr.length > 0));

    const mostDelayedTable = tables.reduce((prev, curr) => {
      if (!curr.mostDelayedDate) {
        return prev;
      }

      if (!prev) {
        return curr;
      }

      if (curr.mostDelayedDate < prev.mostDelayedDate) {
        return curr;
      }

      return prev;
    }, null);

    const waitingOrders = tableOrders.map((orderArr) => orderArr.filter((order) => (order.status === 'waiting')).length);
    const servedOrders = tableOrders.map((orderArr) => orderArr.filter((order) => (order.status === 'served')).length);
    const mostDelayedOrder = tableOrders
      .map((orderArr) => orderArr.reduce((prev, curr) => {
        if (curr.status === 'served') {
          return prev;
        }

        if (!prev) {
          return curr;
        }

        if (curr.createdAt < prev.createdAt) {
          return curr;
        }

        return prev;
      }, null))
      .filter((order) => (order))
      .reduce((prev, curr) => {
        if (!prev) {
          return curr;
        }

        if (curr.createdAt < prev.createdAt) {
          return curr;
        }

        return prev;
      }, null);

    return resolve({
      tables: {
        occupied: tables.filter((table) => (table.status === 'occupied')).length,
        free: tables.filter((table) => (table.status === null)).length,
        mostDelayedName: (mostDelayedTable && mostDelayedTable.name) || '',
      },
      orders: {
        waiting: waitingOrders.reduce((a, b) => a + b, 0),
        served: servedOrders.reduce((a, b) => a + b, 0),
        mostDelayedNo: (mostDelayedOrder && mostDelayedOrder.no) || 0,
      },
      services: {
        waiter: filterService('waiter').length,
        payment: filterService('payment').length,
      },
    });
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

export default {
  GetRestaurantInfo,
  UpdateRestaurantInfo,
  GetRestaurantMetrics,
  GetRestaurantMenu,
  GetRestaurantTable,
  GetRestaurantTables,
  CreateRestaurantTable,
  UpdateRestaurantTable,
  DeleteRestaurantTable,
  AddRestaurantTableService,
  DeleteRestaurantTableService,
  GetRestaurantItem,
  CreateRestaurantItem,
  UpdateRestaurantItem,
  DeleteRestaurantItem,
};
