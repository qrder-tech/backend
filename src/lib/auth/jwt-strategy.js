import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { db } from '../clients';
import constraints from '../constants';
import config from '../../config';

const params = {
  secretOrKey: config.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const strategy = new JwtStrategy(params, async (payload, done) => {
  const consumer = await db.Consumer.findByPk(payload.uuid, {
    attributes: ['uuid'],
  });

  const restaurant = await db.Restaurant.findByPk(payload.uuid, {
    attributes: ['uuid'],
  });

  if (!consumer && !restaurant) {
    return done(constraints.errors.UNAUTH, false);
  }

  return done(null, {
    consumer,
    restaurant,
  });
});

export default strategy;
