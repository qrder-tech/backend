import md5 from 'md5';
import validator from 'validator';
import { Op } from 'sequelize';
import { v4 as _uuid } from 'uuid';

import { db } from '../lib/clients';
import constants from '../lib/constants';
import { generateJwtToken } from '../lib/utils';

const Login = (type, { username, password }) => new Promise(async (resolve, reject) => {
  if (!type || !username || !password) {
    return reject(constants.errors.MISSING_ARGS);
  }

  const modelName = constants.AUTH_TYPES[type.toUpperCase()];

  if (!modelName) {
    return reject(constants.errors.INVALID_ARGS);
  }

  const user = await db[modelName].findOne({
    where: {
      username,
      password: md5(password),
    },
  });

  if (!user) {
    return reject(constants.errors.INVALID_ARGS);
  }

  const token = generateJwtToken(user.uuid);

  return resolve({ token });
});

const Register = (type, {
  name, surname, address, email, phoneNumber, serviceType, username, password,
}) => new Promise(async (resolve, reject) => {
  if (!type || !name || !email || !phoneNumber || !username || !password) {
    return reject(constants.errors.MISSING_ARGS);
  }

  const modelName = constants.AUTH_TYPES[type.toUpperCase()];

  if (!modelName) {
    return reject(constants.errors.INVALID_ARGS);
  }

  if (modelName === constants.AUTH_TYPES.CONSUMER && !surname) {
    return reject(constants.errors.MISSING_ARGS);
  } if (modelName === constants.AUTH_TYPES.RESTAURANT && (!address || !serviceType)) {
    return reject(constants.errors.MISSING_ARGS);
  }

  const isServiceTypeValid = serviceType && constants.SERVICE_TYPES[serviceType.toUpperCase()] != null;

  if (modelName === constants.AUTH_TYPES.RESTAURANT && !isServiceTypeValid) {
    return reject(constants.errors.INVALID_ARGS);
  }

  if (!validator.isEmail(email)) {
    return reject(constants.errors.VALIDATOR_ARGS);
  }

  const isExist = await db[modelName].findOne({
    where: {
      [Op.or]: [
        { username },
        { email },
        { phoneNumber },
      ],
    },
  });

  if (isExist) {
    return reject(constants.errors.DUPLICATED_ARGS);
  }

  try {
    await db[modelName].create({
      uuid: _uuid(),
      name,
      surname,
      address,
      email,
      phoneNumber,
      serviceType,
      username,
      password: md5(password),
    });

    return resolve();
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

export default {
  Login,
  Register,
};
