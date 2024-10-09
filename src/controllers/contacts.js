const pino = require('pino')();
const { getAllContacts, getContactById, createContact, updateContact, deleteContact } = require('../services/contacts');
const createError = require('http-errors');
const mongoose = require('mongoose');

// Контролер для отримання всіх контактів
const getAllContactsController = async (req, res, next) => {
    try {
        const contacts = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts,
        });
    } catch (error) {
        pino.error('Error fetching contacts:', error);
        next(error);
    }
};

// Контролер для отримання контакту за ID
const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        throw createError(404, "Contact not found");
    }

    try {
        const contact = await getContactById(contactId);
        if (!contact) {
            throw createError(404, "Contact not found");
        }
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (error) {
        pino.error('Error fetching contact:', error);
        next(error);
    }
};

// Контролер для створення нового контакту
const createContactController = async (req, res, next) => {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // Перевірка на обов'язкові поля
    if (!name || !phoneNumber || !contactType) {
        throw createError(400, "Name, phoneNumber, and contactType are required");
    }

    try {
        const newContact = await createContact({ name, phoneNumber, email, isFavourite, contactType });
        res.status(201).json({
            status: 201,
            message: "Successfully created a contact!",
            data: newContact,
        });
    } catch (error) {
        pino.error('Error creating contact:', error);
        next(createError(500, "Something went wrong"));
    }
};

// Контролер для оновлення існуючого контакту
const updateContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        throw createError(404, "Contact not found");
    }

    try {
        const updatedContact = await updateContact(contactId, updates);
        if (!updatedContact) {
            throw createError(404, "Contact not found");
        }

        res.status(200).json({
            status: 200,
            message: "Successfully patched the contact!",
            data: updatedContact,
        });
    } catch (error) {
        pino.error('Error updating contact:', error);
        next(createError(500, "Something went wrong"));
    }
};

// Контролер для видалення існуючого контакту
const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        throw createError(404, "Contact not found");
    }

    try {
        const deletedContact = await deleteContact(contactId);
        if (!deletedContact) {
            throw createError(404, "Contact not found");
        }
        res.status(204).send(); // Відповідь без тіла для успішного видалення
    } catch (error) {
        pino.error('Error deleting contact:', error);
        next(createError(500, "Something went wrong"));
    }
};

module.exports = {
    getAllContactsController,
    getContactByIdController,
    createContactController,
    updateContactController,
    deleteContactController,
};
