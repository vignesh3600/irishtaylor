import { Router } from 'express';
import { listUsers } from '../controllers/admin.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect, authorize('admin'));
router.get('/users', listUsers);

export default router;
