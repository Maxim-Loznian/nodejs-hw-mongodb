const express = require('express');
const cors = require('cors');
const pino = require('pino')();
const contactsRouter = require('./routers/contacts'); // Імпорт нового роутера

const setupServer = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Використання роутера для контактів
    app.use('/contacts', contactsRouter);

    // Інші маршрути... (якщо вони є)

    // Запуск сервера
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        pino.info(`Server is running on port ${PORT}`);
    });
};

module.exports = setupServer;
