const express = require('express');
const cors = require('cors');
const pino = require('pino')();
const mongoose = require('mongoose'); // Додано імпорт mongoose
const contactsRouter = require('./routers/contacts');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

// Завантаження змінних середовища
require('dotenv').config();

const setupServer = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Використання роутера для контактів
    app.use('/contacts', contactsRouter);

    // Обробка неіснуючих маршрутів
    app.use(notFoundHandler);

    // Обробка помилок
    app.use(errorHandler);

    // Підключення до MongoDB
    const dbUri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => pino.info('MongoDB connected successfully'))
        .catch(err => pino.error('MongoDB connection error:', err));

    // Запуск сервера
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        pino.info(`Server is running on port ${PORT}`);
    });
};

module.exports = setupServer;
