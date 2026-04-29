import User from '../models/user.model.js';
import { handleError, sendSuccess } from '../utils/response.js';

export const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await User.paginate(
      {},
      {
        page: Number(page),
        limit: Math.min(Number(limit), 100),
        sort: '-createdAt',
        select: '-password',
        lean: true,
        leanWithId: true
      }
    );
    return sendSuccess(res, result, 'Users fetched successfully');
  } catch (error) {
    return handleError(res, error);
  }
};
