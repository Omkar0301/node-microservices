const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const passwordResetSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).max(100).required(),
});

const emailResetSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  newEmail: Joi.string().email().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  passwordResetSchema,
  emailResetSchema,
};
