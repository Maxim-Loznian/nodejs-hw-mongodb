const mongoose = require('mongoose'); // Імпорт Mongoose
const pino = require('pino')(); // Імпорт Pino для логування

const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
    const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(uri); // Підключення до MongoDB
    pino.info('Mongo connection successfully established!'); // Логування успішного підключення
  } catch (error) {
    pino.error('Mongo connection failed:', error.message); // Логування помилки
    process.exit(1); // Завершення процесу з кодом 1
  }
};

module.exports = initMongoConnection; // Експорт функції ініціалізації
