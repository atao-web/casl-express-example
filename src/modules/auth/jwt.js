import { Strategy } from 'passport-jwt';
import { model } from 'mongoose';
import { sign } from 'jsonwebtoken';

let BLANK_JWT;

function findUser(payload, done) {
  const User = model('User');

  if (payload.anonymous) {
    done(null, new User());
    return;
  }

  User.findById(payload.id)
    .then((user) => user ? done(null, user) : done(null, false))
    .catch((error) => done(error, false));
}

export function generateBlankJwt(secret, options) {
  return sign({ anonymous: true }, secret, {
    expiresIn: '365d',
    ...options
  });
}

export function configurePassport(passport, app) {
  const options = {
    issuer: app.get('jwt.issuer'),
    audience: app.get('jwt.audience')
  };
  BLANK_JWT = BLANK_JWT || generateBlankJwt(app.get('jwt.secret'), {
    issuer: app.get('jwt.issuer'),
    audience: app.get('jwt.audience')
  });
  passport.use(new Strategy({
    ...options,
    secretOrKey: app.get('jwt.secret'),
    jwtFromRequest: (req) => req.headers.authorization || BLANK_JWT,
  }, findUser));
}
