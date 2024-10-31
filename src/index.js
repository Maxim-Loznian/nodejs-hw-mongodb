require('dotenv').config(); // Завантаження змінних середовища

const setupServer = require('./server'); // Імпорт функції налаштування сервера
const initMongoConnection = require('./db/initMongoConnection'); // Імпорт функції ініціалізації з'єднання з MongoDB

const startServer = async () => {
  try {
    await initMongoConnection(); // Чекаємо на з'єднання з MongoDB
    setupServer(); // Запускаємо сервер
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer(); // Виклик функції для запуску сервера
