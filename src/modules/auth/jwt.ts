
import { Application, Request } from 'express';
import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions, VerifiedCallback, VerifyCallbackWithRequest } from 'passport-jwt';
import { model } from 'mongoose';
import { sign, Secret, SignOptions } from 'jsonwebtoken';
import { duration } from "moment";

const anonymousExpiresIn = { days: 365 };

export enum JwtParams {
  secret = 'jwt.secret',
  issuer = 'jwt.issuer',
  audience = 'jwt.audience'
};

let BLANK_JWT: string;

const findUser: VerifyCallbackWithRequest = function (req: Request, payload, done: VerifiedCallback): void {
  const userModel = model('User');

  if (payload.anonymous) {
    done(null, new userModel());
    return;
  }

  userModel.findById(payload.id)
    .then(user => user ? done(null, user) : done(null, false))
    .catch(error => done(error, false));
}

export function generateBlankJwt (secret: Secret, options: SignOptions): string {
  const payload = { anonymous: true };
  const signOptions = {
    expiresIn: duration(anonymousExpiresIn).asSeconds(),
    ...options
  }
  const accessToken = sign(payload, secret, signOptions);
  return accessToken;
}

export function configurePassport (passport: PassportStatic, app: Application) {
  const signOptions = {
    issuer: app.get(JwtParams.issuer),
    audience: app.get(JwtParams.audience)
  };

  BLANK_JWT = BLANK_JWT || generateBlankJwt(app.get(JwtParams.secret), signOptions);

  const strategyOptions: StrategyOptions = {
    ...signOptions,
    passReqToCallback: true, 
    secretOrKey: app.get(JwtParams.secret),
    jwtFromRequest: req => {
      const jwt = ExtractJwt.fromAuthHeaderWithScheme('jwt')(req);
      return jwt || BLANK_JWT;
    }
  };

  const strategy = new JwtStrategy(strategyOptions, findUser);

  passport.use('jwt', strategy);

}
