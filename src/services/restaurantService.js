import validator from 'validator';
import { Op } from 'sequelize';
import { v4 as _uuid } from 'uuid';

import { db } from '../lib/clients';
import constants from '../lib/constants';

const GetRestaurantInfo = (uuid) => new Promise(async (resolve, reject) => {
  try {
    const restaurant = await db.Restaurant.findByPk(uuid);
    return resolve(restaurant.dataValues);
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
                }
              } else {
                entity.dataValues.mostDelayedDate = new Date(service.createdAt);
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
                }
              } else {
                entity.dataValues.mostDelayedDate = new Date(order.createdAt);
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

    return resolve(table.dataValues);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const UpdateRestaurantTable = (uuid, restaurantUuid, { name, status, services }) => new Promise(async (resolve, reject) => {
  try {
    if (name === undefined && status === undefined && services === undefined) {
      return reject(constants.errors.MISSING_ARGS);
    }

    if ((status && status !== 'occupied')) {
      return reject(constants.errors.INVALID_ARGS);
    }

    const filteredServices = services && await Promise.all(services.filter((service) => (service.name && service.createdAt)));

    const table = await db.Table.update({
      name,
      status,
      services: (filteredServices && JSON.stringify(filteredServices)) || undefined,
    }, {
      where: {
        uuid,
        restaurantUuid,
      },
    });

    return resolve(table);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

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

export default {
  GetRestaurantInfo,
  UpdateRestaurantInfo,
  GetRestaurantMenu,
  GetRestaurantTables,
  CreateRestaurantTable,
  UpdateRestaurantTable,
  GetRestaurantItem,
  CreateRestaurantItem,
  UpdateRestaurantItem,
  DeleteRestaurantItem,
};
