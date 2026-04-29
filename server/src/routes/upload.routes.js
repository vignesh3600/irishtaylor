import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import { uploadProductImage } from '../middleware/upload.middleware.js';
import { buildErrObject, handleError } from '../utils/response.js';

const router = Router();

router.post('/product-image', protect, authorize('admin'), (req, res) => {
  uploadProductImage.single('image')(req, res, (error) => {
    if (error?.code === 'LIMIT_FILE_SIZE') {
      return handleError(res, buildErrObject(422, 'Image size must be 2 MB or less'));
    }
    if (error) return handleError(res, error);
    return uploadImage(req, res);
  });
});

export default router;
