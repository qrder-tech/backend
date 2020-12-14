import express from 'express';
import { isEmpty } from 'lodash';
// import md5 from 'md5';
import { Op } from 'sequelize';
import { v4 as _uuid } from 'uuid';

// import validator from 'validator';
import constraints from '../lib/constraints';
import { db } from '../lib/clients';

const moment = require('moment');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res /* next */) => {
  const { uuid } = req.query;
  const { user, restaurant } = req; // isteği  kim yaptı

  if (!uuid) {
    const err = constraints.errors.MISSING_ARGS;
    return res.status(err.code).send(err);
  }

  const orderDetails = await db.Order.findOne({
    where: {
      uuid,
      [Op.or]: [
        { userUuid: user && user.uuid },
        { restaurantUuid: restaurant && restaurant.uuid },
      ],
    },
  });

  return res.send(orderDetails);
});

router.post('/new', async (req, res /* next */) => {
  const payload = req.body;
  const { user, restaurant } = req; // isteği  kim yaptı

  if (isEmpty(payload) || !payload.tableUuid || !payload.items) {
    const err = constraints.errors.MISSING_ARGS;
    return res.status(err.code).send(err);
  }

  const { userUuid, restaurantUuid } = payload;

  if (user) {
    if (!restaurantUuid) {
      const err = constraints.errors.MISSING_ARGS;
      return res.status(err.code).send(err);
    }

    // check restaurantUuid is valid
    const temp = await db.Restaurant.findByPk(restaurantUuid, {
      attributes: ['uuid'],
    });

    if (!temp) {
      const err = constraints.errors.INVALID_ARGS;
      return res.status(err.code).send(err);
    }
  } else if (restaurant) {
    if (!userUuid) {
      const err = constraints.errors.MISSING_ARGS;
      return res.status(err.code).send(err);
    }

    // check userUuid is valid
    const temp = await db.User.findByPk(userUuid, {
      attributes: ['uuid'],
    });

    if (!temp) {
      const err = constraints.errors.INVALID_ARGS;
      return res.status(err.code).send(err);
    }
  }

  // check table_id is valid
  // todo: add table model or attribute

  // check items are valid
  if (typeof payload.items !== 'object' || !payload.items.length) {
    const err = constraints.errors.INVALID_ARGS;
    return res.status(err.code).send(err);
  }

  const items = [];
  try {
    await Promise.all(payload.items.map(async (item) => {
      if (!item.metadata || !item.quantity) {
        const err = constraints.errors.INVALID_ARGS;
        err.data = item;
        return res.status(err.code).send(err);
      }

      const isValid = await db.Item.findByPk(item.uuid, { attributes: ['uuid'] });

      if (!isValid) {
        const err = constraints.errors.INVALID_ARGS;
        err.data = item;
        return res.status(err.code).send(err);
      }

      return items.push(item);
    }));
  } catch {
    const err = constraints.errors.INVALID_ARGS;
    return res.status(err.code).send(err);
  }

  if (isEmpty(items)) {
    const err = constraints.errors.INVALID_ARGS;
    return res.status(err.code).send(err);
  }

  // save order to db
  const order = await db.Order.create({
    uuid: _uuid(),
    items: items.map((item) => JSON.stringify(item)).join(', '),
    isPaid: false,
    tableUuid: 'af92bacf-a01a-4903-99d6-2887359c1d23',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    restaurantUuid: (restaurant && restaurant.uuid) || restaurantUuid,
    userUuid: (user && user.uuid) || userUuid,
  });

  if (!order) {
    const err = constraints.errors.UNKNOWN;
    return res.status(err.code).send(err);
  }

  return res.send({ uuid: order.dataValues.uuid });
});

module.exports = router;
