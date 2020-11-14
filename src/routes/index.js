import express from 'express';

import config from '../config';
import { db, mqtt } from '../lib/clients';

import userRouter from './user';
import restaurantRouter from './restaurant';
import orderRouter from './order';

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res /* next */) => {
  const data = { database: null, env: config.env, mqtt: mqtt.connected, status: true, _timestamp: config._timestamp };
  try {
    await db.sequelize.authenticate();
    data.database = true;
  } catch {
    data.database = false;
  }

  res.send(data);
});

export const initializeRoutes = (app) => {
  app.use('/', router);
  app.use('/user', userRouter);
  app.use('/restaurant', restaurantRouter);
  app.use('/order', orderRouter);

};

export const initializeErrorHandlers = (app) => {
  // catch 404 and forward to error handler
  app.use((req, res /* next */) => res.status(404).send());

  // error handler
  app.use((err, req, res /* next */) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
};