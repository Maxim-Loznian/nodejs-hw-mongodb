const pino = require('pino')();
const { getAllContacts, getContactById, createContact, updateContact, deleteContact } = require('../services/contacts');
const createError = require('http-errors');
const mongoose = require('mongoose');

// Отримання всіх контактів з пагінацією, сортуванням та фільтрацією
const getAllContactsController = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
    const filterOptions = { type, isFavourite, userId: req.user._id }; // Фільтрація контактів тільки для конкретного користувача
    const { contacts, totalItems } = await getAllContacts(Number(page), Number(perPage), sortBy, sortOrder, filterOptions);
    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: Number(page),
        perPage: Number(perPage),
        totalItems,
        totalPages,
        hasPreviousPage: Number(page) > 1,
        hasNextPage: Number(page) < totalPages,
      },
    });
  } catch (error) {
    pino.error('Error fetching contacts:', error);
    next(createError(500, 'Something went wrong while fetching contacts'));
  }
};

// Отримання контакту за ID
const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createError(404, 'Contact not found'));
  }

  try {
    const contact = await getContactById(contactId);
    if (!contact || contact.userId.toString() !== req.user._id.toString()) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    pino.error('Error fetching contact:', error);
    next(createError(500, 'Something went wrong while fetching the contact'));
  }
};

// Створення нового контакту
const createContactController = async (req, res, next) => {
  try {
    const newContactData = { ...req.body, userId: req.user._id }; // Додаємо userId до контакту
    const newContact = await createContact(newContactData);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    pino.error('Error creating contact:', error);
    next(createError(500, 'Something went wrong while creating the contact'));
  }
};

// Оновлення існуючого контакту
const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createError(404, 'Contact not found'));
  }

  try {
    const contact = await getContactById(contactId);
    if (!contact || contact.userId.toString() !== req.user._id.toString()) {
      return next(createError(404, 'Contact not found'));
    }

    const updatedContact = await updateContact(contactId, req.body);
    res.status(200).json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: updatedContact,
    });
  } catch (error) {
    pino.error('Error updating contact:', error);
    next(createError(500, 'Something went wrong while updating the contact'));
  }
};

// Видалення існуючого контакту
const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createError(404, 'Contact not found'));
  }

  try {
    const contact = await getContactById(contactId);
    if (!contact || contact.userId.toString() !== req.user._id.toString()) {
      return next(createError(404, 'Contact not found'));
    }

    await deleteContact(contactId);
    res.status(204).send();
  } catch (error) {
    pino.error('Error deleting contact:', error);
    next(createError(500, 'Something went wrong while deleting the contact'));
  }
};

module.exports = {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
};
