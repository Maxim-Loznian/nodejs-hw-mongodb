const express = require('express');
const { createContact, getContacts, getContactById } = require('../controllers/contacts');
const { isValidId } = require('../middlewares/validation');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.use(authenticate); // Застосовуємо middleware аутентифікації

router.post('/', createContact);
router.get('/', getContacts);
router.get('/:contactId', isValidId, getContactById);

module.exports = router;
