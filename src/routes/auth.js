import express from 'express';

import { AuthService } from '../services';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res /* next */) => {
  res.send({ status: 1 });
});

router.post('/login', async (req, res /* next */) => {
  const { type } = req.query;
  const payload = req.body;

  try {
    const result = await AuthService.Login(type, payload);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.post('/registration', async (req, res /* next */) => {
  const { type } = req.query;
  const payload = req.body;

  try {
    const result = await AuthService.Register(type, payload);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

module.exports = router;
