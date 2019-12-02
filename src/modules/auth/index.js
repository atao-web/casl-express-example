import passport from 'passport';
import { configurePassport } from './jwt';
import { create } from './service';
import { createAbilities } from './abilities';

export function configure(app) {
  app.post('/session', create);

  const secret = '!_^secret.casl.authorization?!';

  app.set('jwt.secret', secret);
  app.set('jwt.issuer', 'CASL.Express');
  app.set('jwt.audience', 'casl.io');
  configurePassport(passport, app);
  app.use(passport.initialize());
  app.use(passport.authenticate('jwt', { session: false }), createAbilities);
}
