const express = require('express');
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact, // Додано
} = require('../controllers/contacts');
const { isValidId } = require('../middlewares/validation');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.use(authenticate); // Застосовуємо middleware аутентифікації

router.post('/', createContact);
router.get('/', getContacts);
router.get('/:contactId', isValidId, getContactById);
router.patch('/:contactId', isValidId, updateContact); // Додано маршрут PATCH
router.delete('/:contactId', isValidId, deleteContact); // Додано маршрут DELETE

module.exports = router;
