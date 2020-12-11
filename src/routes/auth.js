import express from 'express';
import { isEmpty } from 'lodash';
import md5 from 'md5';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';

import validator from 'validator';
import { convertType, generateJwtToken, removeEmptyKeys } from '../lib/utils';
import constraints from '../lib/constraints';
import { db } from '../lib/clients';

const router = express.Router();

const AUTH_TYPES = {
  USER: 'User',
  RESTAURANT: 'Restaurant'
};

/* GET users listing. */
router.get('/', (req, res, /* next */) => {
  res.send({ status: 1 });
});

router.post('/login', async (req, res, /* next */) => {
  const { type: _type } = req.query;
  const type = convertType(_type);
  const payload = req.body;

  if (!type || isEmpty(payload) || !payload.username || !payload.password) {
    const err = constraints.errors.MISSING_ARGS;
    return res.status(err.code).send(err);
  }

  const user = await db[type].findOne({
    where: {
      username: payload.username,
      password: md5(payload.password),
    },
  });;

  if (!user) {
    const err = constraints.errors.INVALID_ARGS;
    return res.status(err.code).send(err);
  }

  const token = generateJwtToken(user.uuid);
  return res.send({ token });
});

router.post('/registration', async (req, res, /* next */) => {
  const { type: _type } = req.query;
  const type = convertType(_type);
  const payload = req.body;
  let err;

  // check payload
  if (!type || isEmpty(payload) || !payload.username || !payload.password || !payload.name || !payload.email || !payload.restaurantType) {
    err = constraints.errors.MISSING_ARGS;
  }

  if (type === AUTH_TYPES.USER && !payload.surname) {
    err = constraints.errors.MISSING_ARGS;
  } else if (type === AUTH_TYPES.RESTAURANT && (!payload.address || !payload.phoneNumber)) {
    err = constraints.errors.MISSING_ARGS;
  } else if (type !== AUTH_TYPES.USER && type !== AUTH_TYPES.RESTAURANT) {
    err = constraints.errors.INVALID_ARGS;
  }

  if (err) {
    return res.status(err.code).send(err);
  }

  // validate email
  if (!validator.isEmail(payload.email)) {
    err = constraints.errors.VALIDATOR_ARGS;
    return res.status(err.code).send(err);
  }

  // Check db
  const isExist = await db[type].findOne({
    where: {
      [Op.or]: [
        { username: payload.username },
        { email: payload.email }
      ]
    }
  });

  if (isExist) {
    err = constraints.errors.DUPLICATED_ARGS;
    return res.status(err.code).send(err);
  }

  
  if  (!payload.tableCount)
  {
  // register user
    const credentialsRest = removeEmptyKeys({
      uuid: uuid(),
      name: payload.name,
      surname: payload.surname,
      address: payload.address,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      username: payload.username,
      password: md5(payload.password),
      restaurantType : payload.restaurantType
    });
    const userRest = await db[type].create(credentialsRest);

    if (!userRest) {
      err = constraints.errors.UNKNOWN;
      return res.status(err.code).send(err);
    }

    return res.send({ success: true });
  }
  
  // register user
  const credentials = removeEmptyKeys({
    uuid: uuid(),
    name: payload.name,
    surname: payload.surname,
    address: payload.address,
    phoneNumber: payload.phoneNumber,
    email: payload.email,
    username: payload.username,
    password: md5(payload.password),
    restaurantType : payload.restaurantType,
    tableCount : payload.tableCount
  });
  const user = await db[type].create(credentials);

  if (!user) {
    err = constraints.errors.UNKNOWN;
    return res.status(err.code).send(err);
  }

  return res.send({ success: true });

});

module.exports = router;
