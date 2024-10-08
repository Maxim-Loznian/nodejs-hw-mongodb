const express = require('express');
const router = express.Router();
const {
    getAllContactsController,
    getContactByIdController
} = require('../controllers/contacts'); // Імпорт контролерів

// Маршрут для отримання всіх контактів
router.get('/', getAllContactsController);

// Маршрут для отримання контакту за ID
router.get('/:contactId', getContactByIdController);

module.exports = router;
