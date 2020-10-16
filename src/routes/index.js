import express from 'express';

import { db, mqtt } from '../lib/clients';

import userRouter from './user';
import restaurantRouter from './restaurant';

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res /* next */) => {
  try {
    await db.sequelize.authenticate();
    res.send({ status: true, database: true, mqtt: mqtt.connected }); // 0: offline 1: online 2: maintanance
  } catch {
    res.send({ status: true, database: false, mqtt: mqtt.connected }); // 0: offline 1: online 2: maintanance
  }
});

export const initializeRoutes = (app) => {
  app.use('/', router);
  app.use('/user', userRouter);
  app.use('/restaurant', restaurantRouter);
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