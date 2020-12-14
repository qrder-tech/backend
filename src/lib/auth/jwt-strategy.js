import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { db } from '../clients';
import constraints from '../constraints';
import config from '../../config';

const params = {
  secretOrKey: config.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const strategy = new JwtStrategy(params, async (payload, done) => {
  const user = await db.User.findByPk(payload.uuid, {
    attributes: ['uuid'],
  });

  const restaurant = await db.Restaurant.findByPk(payload.uuid, {
    attributes: ['uuid'],
  });

  if (!user && !restaurant) {
    return done(constraints.errors.UNAUTH, false);
  }

  return done(null, {
    user: user && user.dataValues,
    restaurant: restaurant && restaurant.dataValues,
  });
});

export default strategy;
