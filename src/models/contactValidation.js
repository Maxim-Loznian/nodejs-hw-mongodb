const Joi = require('joi');

// Схема для створення контакту (POST)
const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  email: Joi.string().email().optional(), // Поле email не обов'язкове
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').default('personal'),
});

// Схема для оновлення контакту (PATCH)
const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
}).min(1); // Мінімум одне поле для оновлення

module.exports = { createContactSchema, updateContactSchema };
