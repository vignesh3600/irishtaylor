import { validationResult } from 'express-validator';
import { buildErrObject, handleError } from '../utils/response.js';

export const validateResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    return next();
  } catch (err) {
    return handleError(res, buildErrObject(422, err.array()));
  }
};
