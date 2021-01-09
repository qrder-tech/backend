import { Op } from 'sequelize';
import { v4 as _uuid } from 'uuid';

import { db } from '../lib/clients';
import constants from '../lib/constants';

const GetOffer = (uuid, restaurantUuid) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid || !restaurantUuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const offers = await db.Offer.findOne({
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
        uuid,
        restaurantUuid,
      },
    });

    return resolve(offers);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const GetOffers = (restaurantUuid = null) => new Promise(async (resolve, reject) => {
  try {
    const offers = await db.Offer.findAll({
      include: {
        model: db.Restaurant,
        attributes: [
          'uuid',
          'name',
          'serviceType',
          'img',
        ],
      },
      order: [
        ['updatedAt', 'DESC'],
      ],
      where: {
        restaurantUuid: {
          [restaurantUuid ? Op.eq : Op.ne]: restaurantUuid,
        },
      },
    });

    return resolve(offers);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const CreateOffer = (restaurantUuid, { img }) => new Promise(async (resolve, reject) => {
  try {
    if (!restaurantUuid || !img) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const offer = await db.Offer.create({
      uuid: _uuid(),
      restaurantUuid,
      img,
    });

    return resolve(offer);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const UpdateOffer = (uuid, restaurantUuid, { img }) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid || !restaurantUuid || !img) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const offer = await db.Offer.findOne({
      where: {
        uuid,
        restaurantUuid,
      },
    });

    if (!offer) {
      return reject(constants.errors.ENTITY_NOT_EXIST);
    }

    await offer.update({
      img,
    });

    const updatedOffer = await GetOffer(uuid, restaurantUuid);
    return resolve(updatedOffer);
  } catch (err) {
    const e = constants.errors.UNKNOWN;
    e.extra = err;
    return reject(e);
  }
});

const DeleteOffer = (uuid, restaurantUuid) => new Promise(async (resolve, reject) => {
  try {
    if (!uuid || !restaurantUuid) {
      return reject(constants.errors.MISSING_ARGS);
    }

    const offer = await db.Offer.findOne({
      where: {
        uuid,
        restaurantUuid,
      },
    });

    if (offer) {
      await offer.destroy();
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
  GetOffer,
  GetOffers,
  CreateOffer,
  UpdateOffer,
  DeleteOffer,
};
