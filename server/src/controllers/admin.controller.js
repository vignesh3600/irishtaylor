import User from '../models/user.model.js';
import { handleError, sendSuccess } from '../utils/response.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};

    if (search) {
      const regex = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    const result = await User.paginate(
      query,
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
