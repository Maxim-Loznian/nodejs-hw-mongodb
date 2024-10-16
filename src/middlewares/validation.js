const createError = require('http-errors');
const mongoose = require('mongoose');

// Middleware для валідації ID
const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createError(400, 'Invalid contact ID'));
  }
  next();
};

// Middleware для валідації body
const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(', ');
    return next(createError(400, errorMessage));
  }
  next();
};

module.exports = { validateBody, isValidId };
