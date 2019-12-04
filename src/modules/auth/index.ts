import { Application } from 'express';
import passport from 'passport';

import { configurePassport, JwtParams } from './jwt';
import { createAbilities } from './abilities';
import { create } from './service';

export function configure (app: Application) {
  app.post('/session', create);

  const secret = '!_^secret.casl.authorization?!';

  app.set(JwtParams.secret, secret);
  app.set(JwtParams.issuer, 'CASL.Express');
  app.set(JwtParams.audience, 'casl.io');

  configurePassport(passport, app);

  app.use(passport.initialize());
  app.use(passport.authenticate('jwt', { session: false }), createAbilities);
}
