import express from 'express';
// import { isEmpty } from 'lodash';
// import md5 from 'md5';
// import { Op } from 'sequelize';
// import { v4 as uuid } from 'uuid';

// import validator from 'validator';
import { /* generateJwtToken */ reduceUserDetails } from '../lib/utils';
// import constraints from '../lib/constraints';
import { db } from '../lib/clients';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res /* next */) => {
  res.send({ status: 1 });
});

router.get('/me', async (req, res /* next */) => {
  const { user } = req;

  // todo: include only one Order as an Active Order
  const userDetails = await db.User.findByPk(user.uuid, {
    include: {
      as: 'Orders', model: db.Order, required: false, where: { isPaid: false },
    },
  });
  const reduced = reduceUserDetails(userDetails.dataValues);
  res.send(reduced);
});

router.get('/orders', async (req, res /* next */) => {
  const { user } = req;

  const orders = await db.Order.findAll({
    where: {
      userUuid: user.uuid,
    },
    order: [
      ['isPaid'],
    ],
  });
  await orders.map((order) => { order.items = JSON.parse(`[${order.items}]`); return null });
  return res.send({ orders });
});

module.exports = router;
