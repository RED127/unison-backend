import { Response } from 'express';
import User from '../models/Users';
import { Request, Payload } from '../types';
import jwt from 'jsonwebtoken';

const JWTSECRET = 'unison';
const JWTEXPIRATION = 3600000 * 2;

export const loginDiscord = async (req: Request, res: Response) => {
  let userData = req.body;
  const { id } = req.body;
  const existUser = await User.findOne({ userid: id });
  userData.userid = id;
  userData.nonce = Date.now();

  if (existUser) {
    await User.deleteOne({ userid: id });
    const newUser = new User(userData);
    const user: any = await newUser.save();
    if (!user) {
      return res.status(400).json('Interanal server error');
    } else {
      const payload: Payload = {
        userId: user._id,
        id: user.userid
      };

      jwt.sign(
        payload,
        JWTSECRET,
        { expiresIn: JWTEXPIRATION },
        async (err, token) => {
          if (err) throw err;
          return res.json({ token, user });
        }
      );
    }
  } else {
    const newUser = new User(userData);
    const user: any = await newUser.save();
    if (!user) {
      return res.status(400).json('Interanal server error');
    } else {
      const payload: Payload = {
        userId: user._id,
        id: user.userid
      };

      jwt.sign(
        payload,
        JWTSECRET,
        { expiresIn: JWTEXPIRATION },
        async (err, token) => {
          if (err) throw err;
          return res.json({ token, user });
        }
      );
    }
  }
};
