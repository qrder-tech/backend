// import validator from 'validator';
import { Op } from 'sequelize';
// import { v4 as _uuid } from 'uuid';

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
        model: db.Item,
      },
      where: {
        uuid,
        [Op.or]: [
          restaurantUuid && { restaurantUuid: restaurantUuid || null },
          consumerUuid && { consumerUuid: consumerUuid || null },
        ],
      },
    }).then(entity => {
      if (!entity) {
        return entity;
      }

      entity.dataValues.totalPrice = 0;
      entity.Items.map(item => {
        entity.dataValues.totalPrice += item.price * item.OrderItems.quantity;
        return item;
      });

      return entity;
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
      include: {
        model: db.Item,
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      where: {
        [Op.or]: [
          restaurantUuid && { restaurantUuid: restaurantUuid || null },
          consumerUuid && { consumerUuid: consumerUuid || null },
        ],
      },
    }).then(entities => {
      if (!entities) {
        return entities;
      }

      entities.map(entity => {
        entity.dataValues.totalPrice = 0;
        entity.Items.map(item => {
          entity.dataValues.totalPrice += item.price * item.OrderItems.quantity;
          return item;
        });

        delete entity.dataValues.Items;
        return entity;
      });

      return entities;
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
        status: {
          [Op.ne]: 'paid'
        }
      },
    });

    /*
    todo: find consumerUuid
    if (consumerUuid && order && order[0] === 1) {
      const temp = await GetOrderInfo(uuid, restaurantUuid, consumerUuid);

      if (temp) {
        const totalPrice = temp.totalPrice;

        ConsumerService.UpdateConsumerBalance(consumerUuid, totalPrice * -1);
      }
    }
    */

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
