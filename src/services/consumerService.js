import validator from 'validator';
import { Op } from 'sequelize';
// import { v4 as _uuid } from 'uuid';

import { db } from '../lib/clients';
import constants from '../lib/constants';

const GetConsumerInfo = (uuid) => new Promise(async (resolve, reject) => {
  try {
    const consumer = await db.Consumer.findByPk(uuid, {
      include: {
        model: db.Order,
        limit: 1,
        required: false,
        where: {
          status: {
            [Op.ne]: 'paid',
          },
        },
      },
    });

    return resolve(consumer);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const UpdateConsumerInfo = (uuid, {
  name, surname, email, phoneNumber, img, username, password,
}) => new Promise(async (resolve, reject) => {
  if (name === '' || surname === '' || email === '' || phoneNumber === '' || username === '' || password === '') {
    return reject(constants.errors.VALIDATOR_ARGS);
  }

  if (email && !validator.isEmail(email)) {
    return reject(constants.errors.VALIDATOR_ARGS);
  }

  const isExist = await db.Consumer.findOne({
    where: {
      [Op.or]: [
        { username: username || null },
        { email: email || null },
        { phoneNumber: phoneNumber || null },
      ],
    },
  });

  if (isExist) {
    return reject(constants.errors.DUPLICATED_ARGS);
  }

  try {
    const consumer = await db.Consumer.update({
      name,
      surname,
      email,
      phoneNumber,
      img,
      username,
      password,
    }, {
      where: {
        uuid,
      },
    });
    return resolve(consumer);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const UpdateConsumerBalance = (uuid, { amount }) => new Promise(async (resolve, reject) => {
  if (!amount) {
    return reject(constants.errors.MISSING_ARGS);
  }

  try {
    const consumer = await db.Consumer.increment('balance', {
      by: amount,
      where: {
        uuid,
      },
    });
    return resolve(consumer);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const GetConsumerFavouriteRestaurants = (uuid) => new Promise(async (resolve, reject) => {
  try {
    const favouriteRestaurants = await db.ConsumerFavouriteRestaurants.findAll({
      include: {
        model: db.Restaurant,
        attributes: [
          'uuid',
          'name',
          'serviceType',
          'img',
        ],
      },
      where: {
        consumerUuid: uuid,
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    });

    const favourites = favouriteRestaurants.map((entity) => entity.Restaurant);

    return resolve(favourites);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const AddConsumerFavouriteRestaurant = (uuid, { restaurantUuid }) => new Promise(async (resolve, reject) => {
  try {
    if (!restaurantUuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const isFavouriteRestaurantExist = await db.ConsumerFavouriteRestaurants.findOne({
      where: {
        consumerUuid: uuid,
        restaurantUuid,
      },
    });

    if (isFavouriteRestaurantExist) {
      return reject(constants.errors.DUPLICATED_ARGS);
    }

    const favouriteRestaurant = await db.ConsumerFavouriteRestaurants.create({
      consumerUuid: uuid,
      restaurantUuid,
    });

    return resolve(favouriteRestaurant);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const DeleteConsumerFavouriteRestaurant = (uuid, { restaurantUuid }) => new Promise(async (resolve, reject) => {
  try {
    if (!restaurantUuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const favouriteRestaurant = await db.ConsumerFavouriteRestaurants.findOne({
      where: {
        consumerUuid: uuid,
        restaurantUuid,
      },
    });

    if (favouriteRestaurant) {
      await favouriteRestaurant.destroy();
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

export default {
  GetConsumerInfo,
  UpdateConsumerInfo,
  UpdateConsumerBalance,
  GetConsumerFavouriteRestaurants,
  AddConsumerFavouriteRestaurant,
  DeleteConsumerFavouriteRestaurant,
};
