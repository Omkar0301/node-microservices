const Joi = require('joi');

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(6).max(100).required(),
});

const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  password: Joi.string().min(6).max(100),
  isActive: Joi.boolean(),
}).min(1);

module.exports = {
  createUserSchema,
  updateUserSchema,
};
