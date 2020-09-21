import passport from 'passport';
import constraints from '../constraints';

const UNPROTECTED_ROUTES = [
  '/',
  '/user/login',
  '/user/register'
];

export default (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user /* info */) => {
  if (UNPROTECTED_ROUTES.includes(req.originalUrl)) {
    next();
    return;
  }

  if (err || !user) {
    const e = err || constraints.errors.UNAUTH;
    res.status(e.code).send(e);
    return;
  }

  console.log('auth-middleware:', user);
  req.user = user;
  next();
})(req, res, next);