const express = require('express');
const productController = require('../controllers/productController');
const validate = require('../../../shared/middleware/validation');
const { createProductSchema, updateProductSchema } = require('../validators/productValidator');

const router = express.Router();

router
  .route('/')
  .post(validate(createProductSchema), productController.createProduct)
  .get(productController.getAllProducts);

router
  .route('/:id')
  .get(productController.getProductById)
  .put(validate(updateProductSchema), productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
