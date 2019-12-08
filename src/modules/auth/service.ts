import { Request, Response } from 'express';
import { DocumentType } from '@typegoose/typegoose';
import { utc } from "moment";

import { BadRequest, Unauthorized } from 'http-errors';
import { sign } from 'jsonwebtoken';

import { userInputStore, UserInput } from '../users/model';
import { JwtParams } from './jwt';

const expiresIn = { days: 7 };

/** Create a session, ie... a login!
 * 
 */
export async function create (req: Request, res: Response) {

  const { email, password }: { [tag: string]: string } = req.body.session || {};

  if (!email || !password) {
    throw new BadRequest('Please specify "email" and "password" fields in "session" object');
  }

  const user = await userInputStore.findOne({ email });

  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized('Not authenticated');
  }

  res.send(createAccessToken(req, user));
}

function createAccessToken (req: Request, user: DocumentType<UserInput>) {

  const expiresAt = utc().add(expiresIn);

  const payload = {
    exp: expiresAt.unix(),
    id: user._id
  };

  const secretKey = req.app.get(JwtParams.secret);
  const signOptions = {
    issuer: req.app.get(JwtParams.issuer),
    audience: req.app.get(JwtParams.audience)
  };
  const accessToken = sign(payload, secretKey, signOptions);

  return { 
    token: ['JWT', accessToken].join(' '),
    // accessToken,
    expires: expiresAt.local().format(),
    user: user._id
   };

}
