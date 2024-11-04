import express from 'express'; // Імпорт Express
import cors from 'cors'; // Імпорт CORS
import pino from 'pino'; // Імпорт Pino для логування
import mongoose from 'mongoose'; // Імпорт Mongoose
import cookieParser from 'cookie-parser'; // Імпорт cookie-parser
import contactsRouter from './routers/contacts.js'; // Імпорт роутера для контактів
import authRouter from './routers/auth.js'; // Імпорт роутера для авторизації
import errorHandler from './middlewares/errorHandler.js'; // Імпорт мідлвари для обробки помилок
import notFoundHandler from './middlewares/notFoundHandler.js'; // Імпорт мідлвари для обробки неіснуючих маршрутів

const logger = pino(); // Ініціалізація логера

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
    .then(() => logger.info('MongoDB connected successfully'))
    .catch(err => logger.error('MongoDB connection error:', err));

  // Запуск сервера
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

export default setupServer; // Експорт функції налаштування сервера
