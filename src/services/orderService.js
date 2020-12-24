// import validator from 'validator';
import { Op } from 'sequelize';
// import { v4 as _uuid } from 'uuid';

import { db } from '../lib/clients';
import constants from '../lib/constants';

const GetOrderInfo = (uuid, restaurantUuid, consumerUuid) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const order = await db.Order.findOne({
      include: {
        model: db.Item,
      },
      where: {
        uuid,
        [Op.or]: [
          restaurantUuid && { restaurantUuid: restaurantUuid || null },
          consumerUuid && { consumerUuid: consumerUuid || null },
        ],
      },
    });

    if (!order) {
      return reject(constants.errors.ENTITY_NOT_EXIST);
    }

    return resolve(order.dataValues);
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
    });

    return resolve(order);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const CreateOrder = (/* restaurantUuid, consumerUuid, { tableUuid, items } */) => {

};

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

const PayOrder = (uuid, restaurantUuid, consumerUuid) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const order = await db.Order.update({
      status: 'paid',
    }, {
      where: {
        uuid,
        [Op.or]: [
          restaurantUuid && { restaurantUuid: restaurantUuid || null },
          consumerUuid && { consumerUuid: consumerUuid || null },
        ],
      },
    });

    return resolve(order);
  } catch (err) {
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
