// src/services/contacts.js
const Contact = require('../models/contact');

const getAllContacts = async () => {
    return await Contact.find();
};

const getContactById = async (contactId) => {
    return await Contact.findById(contactId); // Повертає контакт за ID
};

module.exports = {
    getAllContacts,
    getContactById,
};
