import jwt from 'jsonwebtoken';
import { isNil, omitBy } from 'lodash';
import config from '../config';

export const generateJwtToken = (uuid) => jwt.sign({ uuid }, config.JWT_SECRET);

export const getUuidFromToken = (token) => jwt.decode(token, config.JWT_SECRET).uuid;

export const reduceUserDetails = (user) => {
  const blacklist = ['password'];
  return Object.keys(user).filter((key) => !blacklist.includes(key)).reduce((obj, key) => {
    obj[key] = user[key];
    return obj;
  }, {});
};

export const removeEmptyKeys = (obj) => omitBy(obj, isNil);

export const formatArguments = (args) => Object.keys(args).reduce((obj, key) => {
  obj[key] = (args[key] && args[key].trim()) || null;
  return obj;
}, {});

export const parseMqttMessage = (topic, message) => {
  const parsedTopic = topic.split('/');
  return {
    topic,
    credentials: {
      type: parsedTopic[0],
      token: parsedTopic.slice(1).join('.'),
      uuid: getUuidFromToken(parsedTopic.slice(1).join('.')),
    },
    message: JSON.parse(message),
  };
};
