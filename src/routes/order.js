import express from 'express';

import { OrderService } from '../services';

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res /* next */) => {
  const { consumer, restaurant } = req;
  const { uuid } = req.query;

  try {
    const result = await OrderService.GetOrderInfo(uuid, restaurant && restaurant.uuid, consumer && consumer.uuid);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.post('/', async (req, res /* next */) => {

});

router.delete('/', async (req, res /* next */) => {
  const { consumer, restaurant } = req;
  const { uuid } = req.query;

  try {
    const result = await OrderService.DeleteOrder(uuid, restaurant && restaurant.uuid, consumer && consumer.uuid);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.get('/all', async (req, res /* next */) => {
  const { consumer, restaurant } = req;
  const { scope, start, length } = req.query;

  try {
    const result = await OrderService.GetAllOrders(restaurant && restaurant.uuid, consumer && consumer.uuid, { scope, start, length });
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.post('/pay', async (req, res /* next */) => {
  const { consumer, restaurant } = req;
  const { uuid } = req.query;

  try {
    const result = await OrderService.PayOrder(uuid, restaurant && restaurant.uuid, consumer && consumer.uuid);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

module.exports = router;
