import { buildErrObject, handleError, sendSuccess } from '../utils/response.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return handleError(res, buildErrObject(422, 'Image file is required'));
    }

    return sendSuccess(
      res,
      {
        filename: req.file.filename,
        url: `/uploads/products/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size
      },
      'Image uploaded successfully',
      201
    );
  } catch (error) {
    return handleError(res, error);
  }
};
