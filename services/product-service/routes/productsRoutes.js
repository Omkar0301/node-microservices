const express = require('express');
const productController = require('../controllers/productController');
const validate = require('../../../shared/middleware/validation');
const { authenticateJWT } = require('../../../shared/utils/authUtils');
const {
  createProductSchema,
  updateProductSchema,
  getByIdsSchema,
} = require('../validators/productValidator');

const router = express.Router();

router
  .route('/')
  .post(authenticateJWT, validate(createProductSchema), productController.createProduct)
  .get(authenticateJWT, productController.getAllProducts);

router
  .route('/:id')
  .get(authenticateJWT, productController.getProductById)
  .put(authenticateJWT, validate(updateProductSchema), productController.updateProduct)
  .delete(authenticateJWT, productController.deleteProduct);

router
  .route('/batch')
  .post(authenticateJWT, validate(getByIdsSchema), productController.getProductsByIds);

router
  .route('/by-users')
  .post(authenticateJWT, validate(getByIdsSchema), productController.getProductsByUserIds);

module.exports = router;
