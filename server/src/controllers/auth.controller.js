import { matchedData } from 'express-validator';
import User from '../models/user.model.js';
import { signToken } from '../utils/token.js';
import { buildErrObject, handleError, sendSuccess } from '../utils/response.js';

const authResponse = (user) => ({
  user: user.toJSON(),
  token: signToken(user)
});

export const register = async (req, res) => {
  try {
    const data = matchedData(req);
    const user = await User.create(data);
    return sendSuccess(res, authResponse(user), 'User registered successfully', 201);
  } catch (error) {
    if (error.code === 11000) return handleError(res, buildErrObject(409, 'Email already exists'));
    return handleError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const data = matchedData(req);
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user || !(await user.comparePassword(data.password))) {
      return handleError(res, buildErrObject(401, 'Invalid email or password'));
    }
    return sendSuccess(res, authResponse(user), 'User logged in successfully');
  } catch (error) {
    return handleError(res, error);
  }
};

export const me = async (req, res) => {
  try {
    return sendSuccess(res, { user: req.user.toJSON() }, 'User fetched successfully');
  } catch (error) {
    return handleError(res, error);
  }
};
