import { handleError } from '../utils/response.js';

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.code = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  if (error.code === 11000) {
    return handleError(res, { code: 409, message: 'Duplicate value already exists' });
  }

  return handleError(res, error);
};
