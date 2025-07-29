const express = require('express');
const userController = require('../controllers/userController');
const validate = require('../../../shared/middleware/validation');
const { createUserSchema, updateUserSchema } = require('../validators/userValidator');

const router = express.Router();

router.post('/', validate(createUserSchema), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
