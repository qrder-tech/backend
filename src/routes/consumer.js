import express from 'express';

import { ConsumerService } from '../services';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res /* next */) => {
  res.send({ status: 1 });
});

router.get('/me', async (req, res /* next */) => {
  const { consumer } = req;

  try {
    const result = await ConsumerService.GetConsumerInfo(consumer.uuid);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

router.post('/me', async (req, res /* next */) => {
  const { consumer } = req;
  const payload = req.body;

  try {
    const result = await ConsumerService.UpdateConsumerInfo(consumer.uuid, payload);
    return res.send(result);
  } catch (err) {
    return res.status(err.code || 500).send(err);
  }
});

module.exports = router;
