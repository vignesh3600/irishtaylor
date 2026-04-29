import { matchedData } from 'express-validator';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { buildErrObject, handleError, sendSuccess } from '../utils/response.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const populateCart = (cart) =>
  cart.populate({
    path: 'items.product',
    select: 'name brand category price stock imageUrl size color'
  });

export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await populateCart(cart);
    return sendSuccess(res, cart, 'Cart fetched successfully');
  } catch (error) {
    return handleError(res, error);
  }
};

export const addCartItem = async (req, res) => {
  try {
    const data = matchedData(req);
    const product = await Product.findById(data.productId);
    if (!product) return handleError(res, buildErrObject(404, 'Product not found'));
    if (product.stock < data.quantity) {
      return handleError(res, buildErrObject(400, 'Requested quantity exceeds available stock'));
    }

    const cart = await getOrCreateCart(req.user.id);
    const item = cart.items.find((entry) => entry.product.toString() === product.id);
    if (item) {
      const nextQuantity = item.quantity + data.quantity;
      if (nextQuantity > product.stock) {
        return handleError(res, buildErrObject(400, 'Cart quantity exceeds available stock'));
      }
      item.quantity = nextQuantity;
    } else {
      cart.items.push({ product: product.id, quantity: data.quantity });
    }

    await cart.save();
    await populateCart(cart);
    return sendSuccess(res, cart, 'Product added to cart successfully', 201);
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const data = matchedData(req);
    const product = await Product.findById(req.params.productId);
    if (!product) return handleError(res, buildErrObject(404, 'Product not found'));
    if (product.stock < data.quantity) {
      return handleError(res, buildErrObject(400, 'Requested quantity exceeds available stock'));
    }

    const cart = await getOrCreateCart(req.user.id);
    const item = cart.items.find((entry) => entry.product.toString() === req.params.productId);
    if (!item) return handleError(res, buildErrObject(404, 'Cart item not found'));

    item.quantity = data.quantity;
    await cart.save();
    await populateCart(cart);
    return sendSuccess(res, cart, 'Cart item updated successfully');
  } catch (error) {
    return handleError(res, error);
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((entry) => entry.product.toString() !== req.params.productId);
    if (cart.items.length === originalLength) return handleError(res, buildErrObject(404, 'Cart item not found'));

    await cart.save();
    await populateCart(cart);
    return sendSuccess(res, cart, 'Cart item removed successfully');
  } catch (error) {
    return handleError(res, error);
  }
};
