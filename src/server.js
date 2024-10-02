// src/server.js
const express = require('express');
const cors = require('cors');
const pino = require('pino')();
const { getAllContacts, getContactById } = require('./services/contacts'); // Імпорт сервісів

const setupServer = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Отримання всіх контактів
    app.get('/contacts', async (req, res) => {
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
    });

    // Отримання контакту за ID
    app.get('/contacts/:contactId', async (req, res) => {
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
    });

    // Інші маршрути...

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        pino.info(`Server is running on port ${PORT}`);
    });
};

module.exports = setupServer;
