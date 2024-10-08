const express = require('express');
const {
    getAllContactsController,
    getContactByIdController,
    createContactController,
    updateContactController,
    deleteContactController, // Імпортуємо новий контролер
} = require('../controllers/contacts');

const router = express.Router();

router.get('/', getAllContactsController);
router.get('/:contactId', getContactByIdController);
router.post('/', createContactController);
router.patch('/:contactId', updateContactController); // Додаємо маршрут PATCH
router.delete('/:contactId', deleteContactController); // Додаємо новий маршрут DELETE

module.exports = router;
