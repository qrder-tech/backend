import passport from 'passport';
import constraints from '../constants';

const UNPROTECTED_ROUTES = [
  '/',
  '/auth/login',
  '/auth/registration',
];

export default (req, res, next) => passport.authenticate('jwt', { session: false }, (err, payload /* info */) => {
  if (UNPROTECTED_ROUTES.includes(req.path)) {
    next();
    return;
  }

  if (err || !payload) {
    const e = err || constraints.errors.UNAUTH;
    res.status(e.code).send(e);
    return;
  }

  const { consumer, restaurant } = payload;

  // console.log('auth-middleware:', payload);
  // user = { uuid: '3d9b7b60-741f-45aa-b94a-68daa30b7ea6' }

  if (req.path.includes('/consumer') || req.path === '/restaurant') {
    if (!consumer) {
      const e = err || constraints.errors.UNAUTH;
      res.status(e.code).send(e);
      return;
    }
  }

  if (req.path !== '/restaurant' && req.path.includes('/restaurant')) {
    if (!restaurant) {
      const e = err || constraints.errors.UNAUTH;
      res.status(e.code).send(e);
      return;
    }
  }

  req.consumer = consumer && consumer.dataValues;
  req.restaurant = restaurant && restaurant.dataValues;
  next();
})(req, res, next);
