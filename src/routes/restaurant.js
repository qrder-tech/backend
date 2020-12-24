import express from 'express';

import { RestaurantService } from '../services';

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res /* next */) => {
  const { uuid } = req.query;

  try {
    const result = await RestaurantService.GetRestaurantInfo(uuid);
    const Menu = await RestaurantService.GetRestaurantMenu(uuid);
    result.Menu = Menu;
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.get('/me', async (req, res /* next */) => {
  const { restaurant } = req;

  try {
    const result = await RestaurantService.GetRestaurantInfo(restaurant.uuid);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.post('/me', async (req, res /* next */) => {
  const { restaurant } = req;
  const payload = req.body;

  try {
    const result = await RestaurantService.UpdateRestaurantInfo(restaurant.uuid, payload);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.get('/menu', async (req, res) => {
  const { restaurant } = req;

  try {
    const result = await RestaurantService.GetRestaurantMenu(restaurant.uuid);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.get('/tables', async (req, res /* next */) => {
  const { restaurant } = req;

  try {
    const result = await RestaurantService.GetRestaurantTables(restaurant.uuid);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.post('/tables', async (req, res /* next */) => {
  const { restaurant } = req;
  const { uuid } = req.query;
  const payload = req.body;

  try {
    if (uuid) {
      const result = await RestaurantService.UpdateRestaurantTable(uuid, restaurant.uuid, payload);
      return res.send(result);
    } else {
      const result = await RestaurantService.CreateRestaurantTable(restaurant.uuid, payload);
      return res.send(result);
    }
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.get('/item', async (req, res /* next */) => {
  const { restaurant } = req;
  const { uuid } = req.query;

  try {
    const result = await RestaurantService.GetRestaurantItem(uuid, restaurant.uuid);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.post('/item', async (req, res /* next */) => {
  const { restaurant } = req;
  const { uuid } = req.query;
  const payload = req.body;

  try {
    if (uuid) {
      const result = await RestaurantService.UpdateRestaurantItem(uuid, restaurant.uuid, payload);
      return res.send(result);
    } else {
      const result = await RestaurantService.CreateRestaurantItem(restaurant.uuid, payload);
      return res.send(result);
    }
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.delete('/item', async (req, res /* next */) => {
  const { restaurant } = req;
  const { uuid } = req.query;

  try {
    const result = await RestaurantService.DeleteRestaurantItem(uuid, restaurant.uuid);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

module.exports = router;
