import { check } from 'express-validator';
import { validateResult } from '../middleware/validateResult.js';

const categories = ['shirts', 'pants', 'dresses', 'jackets', 'shoes', 'accessories'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

const productRules = (optional = false) => {
  const field = (name, missingMessage) => {
    const validator = check(name);
    return optional ? validator.optional() : validator.exists().withMessage(missingMessage);
  };

  return [
    field('name', 'Name Missing')
      .not()
      .isEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 120 })
      .withMessage('Name must be between 2 and 120 characters')
      .trim(),
    field('description', 'Description Missing')
      .not()
      .isEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters')
      .trim(),
    field('brand', 'Brand Missing')
      .not()
      .isEmpty()
      .withMessage('Brand is required')
      .isLength({ max: 80 })
      .withMessage('Brand must be 80 characters or less')
      .trim(),
    field('category', 'Category Missing')
      .isIn(categories)
      .withMessage('Category is invalid'),
    field('size', 'Size Missing').isIn(sizes).withMessage('Size is invalid'),
    field('color', 'Color Missing')
      .not()
      .isEmpty()
      .withMessage('Color is required')
      .isLength({ max: 40 })
      .withMessage('Color must be 40 characters or less')
      .trim(),
    field('price', 'Price Missing')
      .isFloat({ min: 1, max: 100000 })
      .withMessage('Price must be between 1 and 100000')
      .toFloat(),
    field('stock', 'Stock Missing')
      .isInt({ min: 0, max: 10000 })
      .withMessage('Stock must be between 0 and 10000')
      .toInt(),
    field('imageUrl', 'Image Missing')
      .not()
      .isEmpty()
      .withMessage('Image is required')
      .isLength({ max: 500 })
      .withMessage('Image path must be 500 characters or less')
      .trim(),
    check('isFeatured').optional().isBoolean().withMessage('Featured must be true or false').toBoolean()
  ];
};

export const validateCreateProduct = [...productRules(false), (req, res, next) => validateResult(req, res, next)];
export const validateUpdateProduct = [...productRules(true), (req, res, next) => validateResult(req, res, next)];
