
import { Application } from 'express';
import { PassportStatic } from 'passport';
import { Strategy, StrategyOptions, VerifyCallback, VerifiedCallback } from 'passport-jwt';
import { model } from 'mongoose';
import { sign, Secret, SignOptions } from 'jsonwebtoken';

export enum JwtParams {
  secret = 'jwt.secret',
  issuer = 'jwt.issuer',
  audience = 'jwt.audience'
};

let BLANK_JWT: string;

const findUser: VerifyCallback = function (payload, done: VerifiedCallback): void {
  const userModel = model('User');

  if (payload.anonymous) {
    done(null, new userModel());
    return;
  }

  userModel.findById(payload.id)
    .then(user => user ? done(null, user) : done(null, false))
    .catch(error => done(error, false));
}

export function generateBlankJwt(secret: Secret, options: SignOptions): string {
  return sign({ anonymous: true }, secret, {
    expiresIn: '365d',
    ...options
  });
}

export function configurePassport(passport: PassportStatic, app: Application) {
  const signOptions = {
    issuer: app.get(JwtParams.issuer),
    audience: app.get(JwtParams.audience)
  };
  BLANK_JWT = BLANK_JWT || generateBlankJwt(app.get(JwtParams.secret), signOptions);
  
  const strategyOptions: StrategyOptions = {
    ...signOptions, 
    secretOrKey: app.get(JwtParams.secret),
    jwtFromRequest: req => req.headers.authorization || BLANK_JWT
  };

  const strategy = new Strategy(strategyOptions, findUser);

  passport.use(strategy);

}
