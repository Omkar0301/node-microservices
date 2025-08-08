const express = require('express');
const validate = require('../../../shared/middleware/validation');
const authController = require('../controllers/authController');
const { loginSchema, registerSchema, refreshTokenSchema } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
