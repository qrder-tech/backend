import express from 'express';
// import { isEmpty } from 'lodash';
// import md5 from 'md5';
// import { Op } from 'sequelize';
// import { v4 as uuid } from 'uuid';

// import validator from 'validator';
import { /* generateJwtToken */ reduceUserDetails } from '../lib/utils';
import constraints from '../lib/constraints';
import { db } from '../lib/clients';
// import restaurant from '../topics/restaurant';

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, /* next */) => {
  const { uuid } = req.query;

  if (!uuid) {
    const err = constraints.errors.MISSING_ARGS;
    return res.status(err.code).send(err);
  }

  const restaurantDetails = await db.Restaurant.findByPk(uuid, { include: { as: 'Menu', model: db.Item } });
  const reduced = reduceUserDetails(restaurantDetails.dataValues);
  return res.send(reduced);
});

router.get('/me', async (req, res, /* next */) => {
  const { restaurant } = req;

  const restaurantDetails = await db.Restaurant.findByPk(restaurant.uuid, { include: { as: 'Menu', model: db.Item } });
  const reduced = reduceUserDetails(restaurantDetails.dataValues);
  return res.send(reduced);
});

router.get('/menu', async (req, res,) => {
  const { restaurant } = req;

  const menu = await db.Item.findAll({ where: { restaurantUuid: restaurant.uuid } });
  return res.send({ menu });
});

router.get('/orders', async (req, res, /* next */) => {
  const { restaurant } = req;

  const orders = await db.Order.findAll({
    where: { restaurantUuid: restaurant.uuid },
    order: [
      ['isPaid']
    ]
  });

  return res.send({ orders });
});

module.exports = router;
