const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(1000).optional(),
  price: Joi.number().positive().precision(2).required(),
  stock: Joi.number().integer().min(0).default(0),
  sku: Joi.string().min(3).max(50).required(),
  userId: Joi.string().uuid().required(),
  isActive: Joi.boolean().default(true),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().max(1000).allow(''),
  price: Joi.number().positive().precision(2),
  stock: Joi.number().integer().min(0),
  sku: Joi.string().min(3).max(50),
  userId: Joi.string().uuid(),
  isActive: Joi.boolean(),
}).min(1);

const getByIdsSchema = Joi.object({
  ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
});

module.exports = { createProductSchema, updateProductSchema, getByIdsSchema };
