import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { env } from '../config/env.js';
import { buildErrObject, handleError } from '../utils/response.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.token;

    if (!token) {
      // return handleError(res, buildErrObject(401, 'Authentication required'));
      return handleError(res, buildErrObject(401, 'Please Login To continue'));
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) {
      return handleError(res, buildErrObject(401, 'User account no longer exists'));
    }
    req.user = user;
    return next();
  } catch (error) {
    return handleError(res, buildErrObject(401, 'Invalid or expired token'));
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error('You do not have permission to access this resource');
    error.code = 403;
    return next(error);
  }
  return next();
};
