const productService = require('../services/productService');
const ApiResponse = require('../../../shared/utils/responseFormatter');
const asyncHandler = require('../../../shared/utils/asyncHandler');

class ProductController {
  createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    return res.status(201).json(ApiResponse.success(product, 'Product created successfully'));
  });

  getAllProducts = asyncHandler(async (req, res) => {
    const { limit = 10, offset = 0, users = 'false' } = req.query;
    const includeUsers = users.toLowerCase() === 'true';
    const result = await productService.getAllProducts(
      parseInt(limit),
      parseInt(offset),
      includeUsers
    );
    return res.json(ApiResponse.success(result, 'Products retrieved successfully'));
  });

  getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    return res.json(ApiResponse.success(product, 'Product retrieved successfully'));
  });

  updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    return res.json(ApiResponse.success(product, 'Product updated successfully'));
  });

  deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    return res.json(ApiResponse.success(null, 'Product deleted successfully'));
  });

  getProductsByIds = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    const result = await productService.getProductsByIds(ids);
    return res.json(ApiResponse.success(result, 'Products retrieved successfully'));
  });

  getProductsByUserIds = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    const products = await productService.getProductsByUserIds(ids);
    return res.json(ApiResponse.success(products, 'Products retrieved by user IDs successfully'));
  });
}

module.exports = new ProductController();
