const express = require('express');
const validate = require('../../../shared/middleware/validation');
const authController = require('../controllers/authController');
const {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  passwordResetSchema,
  emailResetSchema,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.put('/email-reset', validate(emailResetSchema), authController.emailReset);
router.post('/password-reset', validate(passwordResetSchema), authController.passwordReset);

router.post('/logout', authController.logout);

module.exports = router;
