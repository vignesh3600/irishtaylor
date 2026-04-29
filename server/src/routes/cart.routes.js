import { Router } from 'express';
import { addCartItem, getCart, removeCartItem, updateCartItem } from '../controllers/cart.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import { validateCartItem, validateCartQuantity } from '../validations/cart.validation.js';

const router = Router();

router.use(protect, authorize('user'));
router.get('/', getCart);
router.post('/items', validateCartItem, addCartItem);
router.patch('/items/:productId', validateCartQuantity, updateCartItem);
router.delete('/items/:productId', removeCartItem);

export default router;
