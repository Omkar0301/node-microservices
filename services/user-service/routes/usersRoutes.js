const express = require('express');
const userController = require('../controllers/userController');
const validate = require('../../../shared/middleware/validation');
const { authenticateJWT } = require('../../../shared/utils/authUtils');
const {
  createUserSchema,
  updateUserSchema,
  getByIdsSchema,
} = require('../validators/userValidator');

const router = express.Router();

router
  .route('/')
  .post(authenticateJWT, validate(createUserSchema), userController.createUser)
  .get(authenticateJWT, userController.getAllUsers);

router.route('/by-email').get(authenticateJWT, userController.getUserByEmail);

router
  .route('/:id')
  .get(authenticateJWT, userController.getUserById)
  .put(authenticateJWT, validate(updateUserSchema), userController.updateUser)
  .delete(authenticateJWT, userController.deleteUser);

router
  .route('/batch')
  .post(authenticateJWT, validate(getByIdsSchema), userController.getUsersByIds);

module.exports = router;
