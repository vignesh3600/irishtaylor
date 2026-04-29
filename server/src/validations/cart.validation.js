import { check } from 'express-validator';
import { validateResult } from '../middleware/validateResult.js';

export const validateCartItem = [
  check('productId')
    .exists()
    .withMessage('Product id Missing')
    .matches(/^[a-f\d]{24}$/i)
    .withMessage('Invalid product id'),
  check('quantity')
    .exists()
    .withMessage('Quantity Missing')
    .isInt({ min: 1, max: 99 })
    .withMessage('Quantity must be between 1 and 99')
    .toInt(),
  (req, res, next) => validateResult(req, res, next)
];

export const validateCartQuantity = [
  check('quantity')
    .exists()
    .withMessage('Quantity Missing')
    .isInt({ min: 1, max: 99 })
    .withMessage('Quantity must be between 1 and 99')
    .toInt(),
  (req, res, next) => validateResult(req, res, next)
];
