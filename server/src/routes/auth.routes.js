import { Router } from 'express';
import { login, me, register } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateLogin, validateRegister } from '../validations/auth.validation.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, me);

export default router;
