const Contact = require('../models/contact'); // Змініть на правильний шлях до вашої моделі

// Отримання всіх контактів з пагінацією, сортуванням та фільтрацією
const getAllContacts = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filterOptions = {}) => {
    const { type, isFavourite } = filterOptions;

    const query = {}; // Об'єкт запиту для фільтрації

    if (type) {
        query.contactType = type; // Додаємо фільтр за типом
    }

    if (isFavourite !== undefined) {
        query.isFavourite = isFavourite === 'true'; // Додаємо фільтр за isFavourite
    }

    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }; // Визначаємо параметри сортування

    const contacts = await Contact.find(query) // Застосовуємо фільтр
        .sort(sortOptions) // Додаємо сортування
        .skip((page - 1) * perPage) // Пропускаємо попередні контакти
        .limit(perPage); // Лімітуємо кількість контактів на сторінці

    const totalItems = await Contact.countDocuments(query); // Загальна кількість контактів з фільтром

    return { contacts, totalItems };
};

// Отримання контакту за ID
const getContactById = async (contactId) => {
    return await Contact.findById(contactId);
};

// Створення нового контакту
const createContact = async (contactData) => {
    const contact = new Contact(contactData);
    return await contact.save();
};

// Оновлення існуючого контакту
const updateContact = async (contactId, updates) => {
    return await Contact.findByIdAndUpdate(contactId, updates, { new: true });
};

// Видалення існуючого контакту
const deleteContact = async (contactId) => {
    return await Contact.findByIdAndDelete(contactId);
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
};
