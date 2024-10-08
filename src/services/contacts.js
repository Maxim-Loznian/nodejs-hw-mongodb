const Contact = require('../models/contact');

// Функція для отримання всіх контактів
const getAllContacts = async () => {
    return await Contact.find();
};

// Функція для отримання контакту за ID
const getContactById = async (contactId) => {
    return await Contact.findById(contactId);
};

// Функція для створення нового контакту
const createContact = async (contactData) => {
    const newContact = new Contact(contactData);
    return await newContact.save();
};

// Функція для видалення контакту
const deleteContact = async (contactId) => {
    return await Contact.findByIdAndDelete(contactId);
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    deleteContact, // Експортуємо новий сервіс
};
