import express from 'express';
import { isEmpty } from 'lodash';
import md5 from 'md5';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';

import validator from 'validator';
import { generateJwtToken, reduceUserDetails } from '../lib/utils';
import constraints from '../lib/constraints';
import { db } from '../lib/clients';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, /* next */) => {
  res.send({ status: 1 });
});

router.post('/login', async (req, res, /* next */) => {
  const payload = req.body;

  if (isEmpty(payload) || !payload.username || !payload.password) {
    const err = constraints.errors.MISSING_ARGS;
    return res.status(err.code).send(err);
  }

  const user = await db.User.findOne({
    where: {
      username: payload.username,
      password: md5(payload.password),
    },
  });

  if (!user) {
    const err = constraints.errors.INVALID_ARGS;
    return res.status(err.code).send(err);
  }

  const token = generateJwtToken(user.uuid);
  return res.send({ token });
});

router.post('/register', async (req, res, /* next */) => {
  const payload = req.body;
  // check payload
  if (isEmpty(payload) || !payload.username || !payload.password || !payload.name || !payload.surname || !payload.email) {
    const err = constraints.errors.MISSING_ARGS;
    return res.status(err.code).send(err);
  }

  // validate email
  if (!validator.isEmail(payload.email)) {
    const err = constraints.errors.VALIDATOR_ARGS;
    return res.status(err.code).send(err);
  }

  // Check db
  const isExist = await db.User.findOne({
    where: {
      [Op.or]: [
        { username: payload.username },
        { email: payload.email }
      ]
    }
  });

  if (isExist) {
    const err = constraints.errors.DUPLICATED_ARGS;
    return res.status(err.code).send(err);
  }

  // register user
  const user = await db.User.create({
    uuid: uuid(),
    name: payload.name,
    surname: payload.surname,
    email: payload.email,
    username: payload.username,
    password: md5(payload.password)
  });

  if (!user) {
    const err = constraints.errors.UNKNOWN;
    return res.status(err.code).send(err);
  }

  return res.send(true);
});

router.get('/me', async (req, res, /* next */) => {
  const { user } = req;

  // todo: include only one Order as an Active Order
  const userDetails = await db.User.findByPk(user.uuid, { include: { as: 'Orders', model: db.Order, required: false, where: { isPaid: false } } });
  const reduced = reduceUserDetails(userDetails.dataValues);
  res.send(reduced);
});

router.get('/me/orders', async (req, res, /* next */) => {
  const { user } = req;

  const orders = await db.Order.findAll({
    where: {
      userUuid: user.uuid,
      isPaid: true
    }
  });

  res.send(orders);
});

module.exports = router;
