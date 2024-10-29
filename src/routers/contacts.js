const express = require('express');
const { validateBody, isValidId } = require('../middlewares/validation');
const { createContactSchema, updateContactSchema } = require('../models/contactValidation');
const {
    getAllContactsController,
    getContactByIdController,
    createContactController,
    updateContactController,
    deleteContactController,
} = require('../controllers/contacts');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/', authenticate, getAllContactsController);
router.get('/:contactId', authenticate, isValidId, getContactByIdController);
router.post('/', authenticate, validateBody(createContactSchema), createContactController);
router.patch('/:contactId', authenticate, isValidId, validateBody(updateContactSchema), updateContactController);
router.delete('/:contactId', authenticate, isValidId, deleteContactController);

module.exports = router;
