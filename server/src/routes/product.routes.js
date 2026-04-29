import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct
} from '../controllers/product.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import { validateCreateProduct, validateUpdateProduct } from '../validations/product.validation.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin'), validateCreateProduct, createProduct);
router.patch('/:id', protect, authorize('admin'), validateUpdateProduct, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
