import express from 'express';
// import { isEmpty } from 'lodash';
// import md5 from 'md5';
// import { Op } from 'sequelize';
// import { v4 as uuid } from 'uuid';

// import validator from 'validator';
import { v4 as _uuid } from 'uuid';
import { /* generateJwtToken */ reduceUserDetails } from '../lib/utils';
import constraints from '../lib/constraints';
import { db } from '../lib/clients';
// import { parse } from 'dotenv/types';

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

  const restaurantDetails = await db.Restaurant.findByPk(resUuid);
  const reduced = reduceUserDetails(restaurantDetails.dataValues);
  return res.send(reduced);
});

router.get('/me', async (req, res, /* next */) => {
  const { restaurant } = req;

  const restaurantDetails = await db.Restaurant.findByPk(restaurant.uuid);
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
      email : payload.email,
      tableCount : payload.tableCount
    }, {
      where: { uuid : restaurant.uuid}
    });
 
  return res.send({ success: true });
});
 


router.get('/menu', async (req, res,) => {
  const { restaurant } = req;

  const menu = await db.Subtopic.findAll({ where: { restaurantUuid: restaurant.uuid } ,  include: {as: 'Items', model: db.Item} });

  /*
  var daomenu = {uuid: menu.uuid, subtopics: []};
  menu.subtopics.map((Subtopic ) => {daomenu.subtopics.push(Subtopic)});
*/
  return res.send({ menu}); // var yeni table ekledim
});

router.get('/orders', async (req, res, /* next */) => {
  const { restaurant } = req;
  const orders = await db.Order.findAll({
    where: { restaurantUuid: restaurant.uuid },
    order: [
      ['isPaid']
    ]
  });
  await orders.map((order) => { order.items = JSON.parse("[" + order.items + "]")}); 
  return res.send({ orders });
});

router.get('/tables', async (req, res, /* next */) => {
  const { restaurant } = req;
  const table = await db.Table.findAll({where: { restaurantUuid: restaurant.uuid },
    include: [{as: 'Services', model: db.Service} ,  { as: 'RecentOrders', model: db.Order } ] 

  });
  return res.send({ table });
});

router.post('/tables', async (req, res, /* next */) => {
  
  const { restaurant } = req;
  const {uuid} = req.query;
  const payload = req.body;
  // if table exists
  if ( uuid !== undefined)
  {
    
    await db.Table.update( 
      {
        name: payload.name, 
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')

      }, {
        where: {uuid}
      });
    
  }
  if ( !payload.name)
  {
    const err = constraints.errors.MISSING_ARGS;
    return res.status(err.code).send(err);

  }
  
  await db.Table.create({
    uuid: _uuid(),
    name: payload.name, 
    restaurantUuid: restaurant.uuid,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
  });
  return res.send({ success: true });
  
});


router.get('/item', async (req, res, /* next */) => {

  const {uuid} = req.query;
  
  const item = await db.Item.findAll({
    where: {uuid}
  });
  if( item === null)
  {
    const err = constraints.errors.UNKNOWN;
    return res.status(err.code).send(err); 
  }
  return res.send( item );
});


router.post('/item', async (req, res, /* next */) => {

  const { restaurant } = req;
  const {uuid} = req.query;
  const payload = req.body;
  // if item exists
  if ( uuid !== undefined)
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
        where: {uuid ,  restaurantUuid : restaurant.uuid}
      });
     
    return res.send({ success: true });
  
  }
  if ( !payload.name || !payload.price || !payload.desc || !payload.subtopicUuid)
  {
    const err = constraints.errors.MISSING_ARGS;
    return res.status(err.code).send(err);

  }
  
  await db.Item.create({
    uuid: _uuid(),
    name: payload.name, 
    price : payload.price,
    desc: payload.desc , 
    metadata : payload.metadata ,
    img: payload.img,
    subtopicUuid: payload.subtopicUuid,
    restaurantUuid : restaurant.uuid,
    itemType : payload.itemType,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
  });
  return res.send({ success: true });
  
});


router.delete('/item', async (req, res, /* next */) => {

  const {uuid} = req.query;

  await db.Item.destroy({
    where: {
      uuid }
  });
  return res.send({ success: true });
});


module.exports = router;
