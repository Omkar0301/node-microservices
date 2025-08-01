const express = require('express');
const userController = require('../controllers/userController');
const validate = require('../../../shared/middleware/validation');
const {
  createUserSchema,
  updateUserSchema,
  getByIdsSchema,
} = require('../validators/userValidator');

const router = express.Router();

router
  .route('/')
  .post(validate(createUserSchema), userController.createUser)
  .get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUserById)
  .put(validate(updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

router.route('/batch').post(validate(getByIdsSchema), userController.getUsersByIds);

module.exports = router;
