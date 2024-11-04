import dotenv from 'dotenv';
import setupServer from './server.js'; // Імпорт функції налаштування сервера
import initMongoConnection from './db/initMongoConnection.js'; // Імпорт функції ініціалізації з'єднання з MongoDB

dotenv.config(); // Завантаження змінних середовища

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
