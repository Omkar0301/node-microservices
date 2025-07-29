const express = require('express');
const productController = require('../controllers/productController');
const validate = require('../../../shared/middleware/validation');
const { createProductSchema, updateProductSchema } = require('../validators/productValidator');

const router = express.Router();

router.post('/', validate(createProductSchema), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
