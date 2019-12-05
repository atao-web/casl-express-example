import { BadRequest, Unauthorized } from 'http-errors';
import { sign } from 'jsonwebtoken';

import { userInputStore } from '../users/model';
import { JwtParams } from './jwt';

export async function create(req, res) {
  const { email, password } = req.body.session || {};

  if (!email || !password) {
    throw new BadRequest('Please specify "email" and "password" fields in "session" object');
  }

  const user = await userInputStore.findOne({ email });

  if (!user || !await user.comparePassword(password)) {
    throw new Unauthorized('Not authenticated');
  }

  const accessToken = sign({ id: user._id }, req.app.get(JwtParams.secret), {
    issuer: req.app.get(JwtParams.issuer),
    audience: req.app.get(JwtParams.audience)
  });

  res.send({ accessToken });
}
