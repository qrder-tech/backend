import express from 'express';
import { isEmpty } from 'lodash';
// import md5 from 'md5';
// import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';

// import validator from 'validator';
import constraints from '../lib/constraints';
import { db } from '../lib/clients';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, /* next */) => {
  res.send({ status: 1 });
});

router.post('/new', async (req, res, /* next */) => {
  const payload = req.body;
  const { user } = req;

  if (isEmpty(payload) || !payload.restaurant_uuid || !payload.table_id || !payload.items) {
    const err = constraints.errors.MISSING_ARGS;
    return res.status(err.code).send(err);
  }

  // check restaurant_uuid is valid
  const restaurant = await db.Restaurant.findByPk(payload.restaurant_uuid, {
    attributes: ['uuid'],
  });

  if (!restaurant) {
    const err = constraints.errors.INVALID_ARGS;
    return res.status(err.code).send(err);
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
    await Promise.all(payload.items.map(async item => {
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
    uuid: uuid(),
    items: items.map(item => JSON.stringify(item)).join(', '),
    restaurantUuid: payload.restaurant_uuid,
    userUuid: user.uuid
  });

  if (!order) {
    const err = constraints.errors.UNKNOWN;
    return res.status(err.code).send(err);
  }

  return res.send(true);
});

module.exports = router;
