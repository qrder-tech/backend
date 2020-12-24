import validator from 'validator';
import { Op } from 'sequelize';
import { v4 as _uuid } from 'uuid';

import { db } from '../lib/clients';
import constants from '../lib/constants';

const GetRestaurantInfo = (uuid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await db.Restaurant.findByPk(uuid);
      return resolve(restaurant.dataValues);
    } catch (err) {
      const e = constants.errors.UNKNOWN;
      e.extra = err;
      return reject(e);
    }
  });
};

const UpdateRestaurantInfo = (uuid, { name, address, email, phoneNumber, serviceType, img, username, password }) => {
  return new Promise(async (resolve, reject) => {
    if (name === "" || address === "" || email === "" || phoneNumber === "" || serviceType === "" || username === "" || password === "") {
      return reject(constants.errors.VALIDATOR_ARGS);
    }

    const isServiceTypeValid = serviceType && (constants.SERVICE_TYPES[serviceType.toUpperCase()] != null);

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
          { phoneNumber: phoneNumber || null }
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
        password
      }, {
        where: {
          uuid
        }
      });
      return resolve(restaurant);
    } catch (err) {
      const e = constants.errors.UNKNOWN;
      e.extra = err;
      return reject(e);
    }
  });
};

const GetRestaurantMenu = (restaurantUuid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const items = await db.Item.findAll({
        where: {
          restaurantUuid
        },
      });

      const catalog = [];
      const catalogWithItems = {};

      items.map(item => {
        if (!catalog.includes(item.type)) {
          catalog.push(item.type);
          catalogWithItems[item.type] = [];
        }

        catalogWithItems[item.type].push(item);
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
};

const GetRestaurantTables = (restaurantUuid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tables = await db.Table.findAll({
        include: {
          model: db.Order,
          where: {
            status: {
              [Op.ne]: 'paid'
            }
          },
          include: {
            model: db.Item,
          },
          required: false,
        },
        where: {
          restaurantUuid
        }
      });

      return resolve(tables);
    } catch (err) {
      console.error(err);
      const e = constants.errors.UNKNOWN;
      e.extra = err;
      return reject(e);
    }
  });
};

const CreateRestaurantTable = (restaurantUuid, { name }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!name || name == "") {
        return reject(constants.errors.MISSING_ARGS);
      }

      const table = await db.Table.create({
        uuid: _uuid(),
        name,
        restaurantUuid
      });

      return resolve(table.dataValues);
    } catch (err) {
      const e = constants.errors.UNKNOWN;
      e.extra = err;
      return reject(e);
    }
  });
};

const UpdateRestaurantTable = (uuid, restaurantUuid, { name }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!name || name == "") {
        return reject(constants.errors.MISSING_ARGS);
      }

      const table = await db.Table.update({
        name
      }, {
        where: {
          uuid,
          restaurantUuid
        }
      });

      return resolve(table);
    } catch (err) {
      const e = constants.errors.UNKNOWN;
      e.extra = err;
      return reject(e);
    }
  });
};

const GetRestaurantItem = (uuid, restaurantUuid) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!uuid || uuid == "") {
        return reject(constants.errors.MISSING_ARGS);
      }

      const item = await db.Item.findOne({
        where: {
          uuid,
          restaurantUuid
        }
      });

      if (!item) {
        return reject(constants.errors.ENTITY_NOT_EXIST);
      }

      item.dataValues.options = item.options.split(';');
      return resolve(item && item.dataValues);
    } catch (err) {
      const e = constants.errors.UNKNOWN;
      e.extra = err;
      return reject(e);
    }
  });
};

const CreateRestaurantItem = (restaurantUuid, { name, desc, type, options, price, img, enabled }) => {
  return new Promise(async (resolve, reject) => {
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
        restaurantUuid
      });
      return resolve(item.dataValues);
    } catch (err) {
      const e = constants.errors.UNKNOWN;
      e.extra = err;
      return reject(e);
    }
  });
};

const UpdateRestaurantItem = (uuid, restaurantUuid, { name, desc, type, options, price, img, enabled }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (name === "" || desc === "" || type === "" || options === "", price === "", enabled === "") {
        return reject(constants.errors.INVALID_ARGS);
      }

      const item = await db.Item.update({
        name,
        desc,
        type,
        options: (options && options.join(';')) || null,
        price,
        img,
        enabled
      }, {
        where: {
          uuid,
          restaurantUuid
        }
      });
      return resolve(item);
    } catch (err) {
      const e = constants.errors.UNKNOWN;
      e.extra = err;
      return reject(e);
    }
  });
};

const DeleteRestaurantItem = (uuid, restaurantUuid) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!uuid) {
        return reject(constants.errors.MISSING_ARGS);
      }

      const item = await db.Item.findOne({
        where: {
          uuid,
          restaurantUuid
        }
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
};

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
  DeleteRestaurantItem
}