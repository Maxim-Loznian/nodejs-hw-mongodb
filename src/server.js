const express = require('express'); // Імпорт Express
const cors = require('cors'); // Імпорт CORS
const pino = require('pino')(); // Імпорт Pino для логування
const mongoose = require('mongoose'); // Імпорт Mongoose
const cookieParser = require('cookie-parser'); // Імпорт cookie-parser
const contactsRouter = require('./routers/contacts'); // Імпорт роутера для контактів
const authRouter = require('./routers/auth'); // Імпорт роутера для авторизації
const errorHandler = require('./middlewares/errorHandler'); // Імпорт мідлвари для обробки помилок
const notFoundHandler = require('./middlewares/notFoundHandler'); // Імпорт мідлвари для обробки неіснуючих маршрутів

// Завантаження змінних середовища
require('dotenv').config();

const setupServer = () => {
    const app = express();

    // Використання middleware
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser()); // Додайте cookie-parser

    // Використання роутерів
    app.use('/contacts', contactsRouter);
    app.use('/auth', authRouter); // Додаємо роутер для auth

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

module.exports = setupServer; // Експорт функції налаштування сервера
