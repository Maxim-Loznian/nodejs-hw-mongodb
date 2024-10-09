const Contact = require('../models/contact');

// Отримати всі контакти
const getAllContacts = async () => {
    return await Contact.find();
};

// Отримати контакт за ID
const getContactById = async (id) => {
    return await Contact.findById(id);
};

// Створити новий контакт
const createContact = async (contactData) => {
    return await Contact.create(contactData);
};

// Оновити існуючий контакт
const updateContact = async (id, updates) => {
    return await Contact.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

// Видалити контакт
const deleteContact = async (id) => {
    return await Contact.findByIdAndDelete(id);
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
};
