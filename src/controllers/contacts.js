const pino = require('pino')();
const { getAllContacts, getContactById } = require('../services/contacts'); // Імпорт сервісів

// Контролер для отримання всіх контактів
const getAllContactsController = async (req, res, next) => {
    try {
        const contacts = await getAllContacts(); // Виклик сервісу
        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts,
        });
    } catch (error) {
        pino.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
};

// Контролер для отримання контакту за ID
const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const contact = await getContactById(contactId); // Виклик сервісу
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (error) {
        pino.error('Error fetching contact:', error);
        res.status(500).json({ message: 'Error fetching contact' });
    }
};

module.exports = {
    getAllContactsController,
    getContactByIdController,
};
