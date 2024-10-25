const createHttpError = require('http-errors');
const contactsService = require('../services/contacts');
const { validateBody } = require('../middlewares/validation');
const { contactSchema } = require('../schemas/contact');

// Отримання всіх контактів з параметрами фільтрації, сортування та пагінації
const getContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

    const filterOptions = { type, isFavourite };
    const { contacts, totalItems } = await contactsService.getAllContacts(userId, page, perPage, sortBy, sortOrder, filterOptions);

    // Визначення загальної кількості сторінок та наявності попередньої/наступної сторінок
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    res.status(200).json({
      status: 200,
      data: {
        contacts,
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        totalItems,
        totalPages,
        hasPrevPage,
        hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Отримання контакту за ID
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

// Створення нового контакту
const createContact = async (req, res, next) => {
  try {
    // Валідація тіла запиту
    await validateBody(contactSchema)(req, res, next);

    const { name, email, phoneNumber, contactType, isFavourite } = req.body;
    const userId = req.user.id;

    const newContact = await contactsService.createContact({ name, email, phoneNumber, contactType, isFavourite, userId });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully!',
      data: newContact,
    });
  } catch (error) {
    // Переконатися, що статус і повідомлення у правильному форматі
    return next(createHttpError(400, `Contact validation failed: ${error.message}`));
  }
};

// Оновлення контакту
const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id;

    // Валідація тіла запиту
    await validateBody(contactSchema)(req, res, next);

    const { name, email, phoneNumber, contactType, isFavourite } = req.body;

    const updatedContact = await contactsService.updateContact(userId, contactId, { name, email, phoneNumber, contactType, isFavourite });

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully!',
      data: updatedContact,
    });
  } catch (error) {
    return next(createHttpError(400, `Contact validation failed: ${error.message}`));
  }
};

// Видалення контакту
const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id;

    const deletedContact = await contactsService.deleteContact(userId, contactId);

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
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
