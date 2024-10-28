const express = require('express');
const {
  createContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
  deleteContactController,
} = require('../controllers/contacts');
const { isValidId, validateBody } = require('../middlewares/validation');
const authenticate = require('../middlewares/authenticate');
const { createContactSchema, updateContactSchema } = require('../models/contactValidation');

const router = express.Router();

// Застосовуємо middleware аутентифікації для всіх маршрутів
router.use(authenticate);

// Створити новий контакт з валідацією тіла запиту
router.post('/', validateBody(createContactSchema), createContactController);

// Отримати всі контакти
router.get('/', getAllContactsController);

// Отримати контакт за ID з валідацією ID
router.get('/:contactId', isValidId, getContactByIdController);

// Оновити контакт з валідацією ID та тіла запиту
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), updateContactController);

// Видалити контакт з валідацією ID
router.delete('/:contactId', isValidId, deleteContactController);

module.exports = router;
