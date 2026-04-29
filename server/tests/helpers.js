import User from '../src/models/user.model.js';
import Product from '../src/models/product.model.js';
import { signToken } from '../src/utils/token.js';

export const createUser = async (overrides = {}) => {
  const user = await User.create({
    name: overrides.name || 'Test User',
    email: overrides.email || `user-${Date.now()}@example.com`,
    password: overrides.password || 'Password123',
    role: overrides.role || 'user'
  });
  return { user, token: signToken(user) };
};

export const createProduct = async (overrides = {}) =>
  Product.create({
    name: 'Oxford Shirt',
    description: 'A crisp cotton shirt for daily wear.',
    brand: 'ThreadLab',
    category: 'shirts',
    size: 'M',
    color: 'White',
    price: 1499,
    stock: 12,
    imageUrl: 'https://example.com/shirt.jpg',
    ...overrides
  });
