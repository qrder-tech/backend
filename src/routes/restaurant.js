import express from 'express';
// import { isEmpty } from 'lodash';
// import md5 from 'md5';
// import { Op } from 'sequelize';
// import { v4 as uuid } from 'uuid';

// import validator from 'validator';
import { v4 as uuid } from 'uuid';
import { /* generateJwtToken */ reduceUserDetails } from '../lib/utils';
import constraints from '../lib/constraints';
import { db } from '../lib/clients';

const moment = require('moment');

// import restaurant from '../topics/restaurant';

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, /* next */) => {
  const { resUuid } = req.query;

  if (!resUuid) {
    const err = constraints.errors.MISSING_ARGS;
    return res.status(err.code).send(err);
  }

  const restaurantDetails = await db.Restaurant.findByPk(resUuid, { include: { as: 'Menu', model: db.Item } });
  const reduced = reduceUserDetails(restaurantDetails.dataValues);
  return res.send(reduced);
});

router.get('/me', async (req, res, /* next */) => {
  const { restaurant } = req;

  const restaurantDetails = await db.Restaurant.findByPk(restaurant.uuid, { include: { as: 'Menu', model: db.Item } });
  const reduced = reduceUserDetails(restaurantDetails.dataValues);
  return res.send(reduced);
});


router.post('/me', async (req, res, /* next */) => {
  const { restaurant } = req;
  const payload = req.body;
  await db.Restaurant.update( 
    {
      name: payload.name, 
      address : payload.price,
      phoneNumber : payload.phoneNumber , 
      email : payload.email 
    }, {
      where: { uuid : restaurant.uuid}
    });
 
  return res.send({ success: true });
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


router.get('/item', async (req, res, /* next */) => {

  const { restaurant } = req;
  const {itemUuid} = req.query;
  
  const item = await db.Item.findAll({
    where: {uuid : itemUuid ,  restaurantUuid : restaurant.uuid}
  });
  
  return res.send( item );
});


router.post('/item', async (req, res, /* next */) => {

  const { restaurant } = req;
  const {itemUuid} = req.query;
  const payload = req.body;
  // if item exists
  if ( itemUuid !== undefined)
  {
    
    await db.Item.update( 
      {
        name: payload.name, 
        price : payload.price,
        desc: payload.desc , 
        metadata : payload.metadata ,
        img: payload.img,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')

      }, {
        where: {uuid : itemUuid ,  restaurantUuid : restaurant.uuid}
      });
     
    return res.send({ success: true });
  }
  
  await db.Item.create({
    uuid: uuid(),
    name: payload.name, 
    price : payload.price,
    desc: payload.desc , 
    metadata : payload.metadata ,
    //  img: payload.img,
    restaurantUuid : restaurant.uuid,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
  });
  return res.send({ success: true });
  
});


router.delete('/item', async (req, res, /* next */) => {

  const {itemUuid} = req.query;

  await db.Item.destroy({
    where: {
      uuid: itemUuid }
  });
  return res.send({ success: true });
});


module.exports = router;
