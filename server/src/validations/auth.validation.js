import { check } from 'express-validator';
import { validateResult } from '../middleware/validateResult.js';

export const validateRegister = [
  check('name')
    .exists()
    .withMessage('Name Missing')
    .not()
    .isEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters')
    .trim(),
  check('email')
    .exists()
    .withMessage('Email Missing')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Enter a valid email')
    .normalizeEmail(),
  check('password')
    .exists()
    .withMessage('Password Missing')
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 80 })
    .withMessage('Password must be between 8 and 80 characters'),
  (req, res, next) => validateResult(req, res, next)
];

export const validateLogin = [
  check('email')
    .exists()
    .withMessage('Email Missing')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Enter a valid email')
    .normalizeEmail(),
  check('password').exists().withMessage('Password Missing').not().isEmpty().withMessage('Password is required'),
  (req, res, next) => validateResult(req, res, next)
];
