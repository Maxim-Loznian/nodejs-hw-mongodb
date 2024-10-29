const pino = require('pino')();
const {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
} = require('../services/contacts');
const createError = require('http-errors');
const mongoose = require('mongoose');

// Отримання всіх контактів
const getAllContactsController = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

        const filterOptions = { type, isFavourite };
        const { contacts, totalItems } = await getAllContacts(userId, Number(page), Number(perPage), sortBy, sortOrder, filterOptions);
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
        next(createError(500, 'Something went wrong'));
    }
};

// Отримання контакту за ID
const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(400).json({ status: 400, message: 'Invalid contact ID format' });
    }

    try {
        const contact = await getContactById(contactId, userId);
        if (!contact) {
            return res.status(404).json({ status: 404, message: 'Contact not found' });
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (error) {
        pino.error('Error fetching contact:', error);
        next(createError(500, 'Something went wrong'));
    }
};

// Створення нового контакту
const createContactController = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const newContact = await createContact(req.body, userId);
        res.status(201).json({
            status: 201,
            message: 'Successfully created a contact!',
            data: newContact,
        });
    } catch (error) {
        pino.error('Error creating contact:', error);
        next(createError(500, 'Something went wrong'));
    }
};

// Оновлення існуючого контакту
const updateContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(400).json({ status: 400, message: 'Invalid contact ID format' });
    }

    try {
        const updatedContact = await updateContact(contactId, req.body, userId);
        if (!updatedContact) {
            return res.status(404).json({ status: 404, message: 'Contact not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully updated the contact!',
            data: updatedContact,
        });
    } catch (error) {
        pino.error('Error updating contact:', error);
        next(createError(500, 'Something went wrong'));
    }
};

// Видалення існуючого контакту
const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(400).json({ status: 400, message: 'Invalid contact ID format' });
    }

    try {
        const deletedContact = await deleteContact(contactId, userId);
        if (!deletedContact) {
            return res.status(404).json({ status: 404, message: 'Contact not found' });
        }
        res.status(204).send();
    } catch (error) {
        pino.error('Error deleting contact:', error);
        next(createError(500, 'Something went wrong'));
    }
};

module.exports = {
    getAllContactsController,
    getContactByIdController,
    createContactController,
    updateContactController,
    deleteContactController,
};
