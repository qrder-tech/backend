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
router.get('/', (req, res, /* next */) => {
  res.send({ status: 1 });
});

router.get('/:uuid', async (req, res, /* next */) => {
  const { uuid } = req.params;
  const restaurantDetails = await db.Restaurant.findByPk(uuid, { include: { as: 'Menu', model: db.Item } });
  const reduced = reduceUserDetails(restaurantDetails.dataValues);
  res.send(reduced);
});

module.exports = router;
