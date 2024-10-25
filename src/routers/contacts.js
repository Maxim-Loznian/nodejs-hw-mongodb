const express = require('express');
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require('../controllers/contacts');
const { isValidId, validateBody } = require('../middlewares/validation');
const authenticate = require('../middlewares/authenticate');
const { contactSchema } = require('../schemas/contact');

const router = express.Router();

// Застосовуємо middleware аутентифікації для всіх маршрутів
router.use(authenticate);

// Створити новий контакт з валідацією тіла запиту
router.post('/', validateBody(contactSchema), createContact);

// Отримати всі контакти
router.get('/', getContacts);

// Отримати контакт за ID з валідацією ID
router.get('/:contactId', isValidId, getContactById);

// Оновити контакт з валідацією ID та тіла запиту
router.patch('/:contactId', isValidId, validateBody(contactSchema), updateContact);

// Видалити контакт з валідацією ID
router.delete('/:contactId', isValidId, deleteContact);

module.exports = router;
