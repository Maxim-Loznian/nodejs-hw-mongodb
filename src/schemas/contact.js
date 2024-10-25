const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  contactType: Joi.string().valid('work', 'home', 'personal').default('personal'),
  isFavourite: Joi.boolean().default(false),
});

module.exports = { contactSchema };
