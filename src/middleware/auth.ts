import { Response, NextFunction } from 'express';
import HttpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Payload, Request } from '../types';
import User from '../models/Users';
const JWTSECRET = 'unison';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: 'No token, authorization denied' });
  }
  try {
    const payload: Payload | any = jwt.verify(token, JWTSECRET);
    req.userId = payload.userId;
    req.id = payload.id;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json('Please login again');
    }
    req.user = user;
    next();
  } catch (err) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: 'Token is not valid' });
  }
}
