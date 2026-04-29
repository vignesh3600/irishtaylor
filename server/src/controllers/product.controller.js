import { matchedData } from 'express-validator';
import Product from '../models/product.model.js';
import { emitStockAlert } from '../config/socket.js';
import { env } from '../config/env.js';
import { buildErrObject, handleError, sendSuccess } from '../utils/response.js';

const maybeEmitStockAlert = (product) => {
  if (product.stock <= env.lowStockThreshold) {
    emitStockAlert({
      productId: product.id,
      name: product.name,
      stock: product.stock,
      severity: product.stock === 0 ? 'out' : 'low',
      message: product.stock === 0 ? `${product.name} is out of stock` : `${product.name} is low on stock`
    });
  }
};

export const listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, category, sort = '-createdAt' } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;

    const result = await Product.paginate(query, {
      page: Number(page),
      limit: Math.min(Number(limit), 50),
      sort,
      lean: true,
      leanWithId: true
    });

    return sendSuccess(res, result, 'Products fetched successfully');
  } catch (error) {
    return handleError(res, error);
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return handleError(res, buildErrObject(404, 'Product not found'));
    return sendSuccess(res, product, 'Product fetched successfully');
  } catch (error) {
    return handleError(res, error);
  }
};

export const createProduct = async (req, res) => {
  try {
    const data = matchedData(req);
    const product = await Product.create({
      ...data,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });
    maybeEmitStockAlert(product);
    return sendSuccess(res, product, 'Product created successfully', 201);
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = matchedData(req);
    const product = await Product.findById(req.params.id);
    if (!product) return handleError(res, buildErrObject(404, 'Product not found'));

    Object.assign(product, data, { updatedBy: req.user.id });
    await product.save();
    maybeEmitStockAlert(product);
    return sendSuccess(res, product, 'Product updated successfully');
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return handleError(res, buildErrObject(404, 'Product not found'));
    await product.delete();
    return sendSuccess(res, product, 'Product deleted successfully');
  } catch (error) {
    return handleError(res, error);
  }
};
