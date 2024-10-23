const createHttpError = require('http-errors');
const contactsService = require('../services/contacts');

// Отримання всіх контактів з параметрами фільтрації, сортування та пагінації
const getContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

    const filterOptions = { type, isFavourite };
    const { contacts, totalItems } = await contactsService.getAllContacts(userId, page, perPage, sortBy, sortOrder, filterOptions);

    res.status(200).json({
      status: 200,
      data: { contacts, totalItems },
    });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id;

    const contact = await contactsService.getContactById(userId, contactId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, contactType, isFavourite } = req.body;
    const userId = req.user.id;

    const newContact = await contactsService.createContact({ name, email, phone, contactType, isFavourite, userId });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id;
    const { name, email, phone, contactType, isFavourite } = req.body;

    const updatedContact = await contactsService.updateContact(userId, contactId, { name, email, phone, contactType, isFavourite });

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id;

    const deletedContact = await contactsService.deleteContact(userId, contactId);

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send(); // Повертає статус 204 без тіла
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
