const productService = require('../services/productService');
const ApiResponse = require('../../../shared/utils/responseFormatter');
const asyncHandler = require('../../../shared/utils/asyncHandler');

class ProductController {
  createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    const response = ApiResponse.success(product, 'Product created successfully', 201);
    res.status(response.statusCode).json(response);
  });

  getAllProducts = asyncHandler(async (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    const result = await productService.getAllProducts(limit, offset);
    const response = ApiResponse.success(result, 'Products retrieved successfully');
    res.status(response.statusCode).json(response);
  });

  getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    const response = ApiResponse.success(product, 'Product retrieved successfully');
    res.status(response.statusCode).json(response);
  });

  updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);
    const response = ApiResponse.success(product, 'Product updated successfully');
    res.status(response.statusCode).json(response);
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await productService.deleteProduct(id);
    const response = ApiResponse.success(null, 'Product deleted successfully');
    res.status(response.statusCode).json(response);
  });
}

module.exports = new ProductController();
