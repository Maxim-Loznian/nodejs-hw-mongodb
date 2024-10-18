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

const router = express.Router();

router.get('/', getAllContactsController);
router.get('/:contactId', isValidId, getContactByIdController);
router.post('/', validateBody(createContactSchema), createContactController);
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), updateContactController);
router.delete('/:contactId', isValidId, deleteContactController);

module.exports = router;
