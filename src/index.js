require('dotenv').config();

const setupServer = require('./server');
const initMongoConnection = require('./db/initMongoConnection');

const startServer = async () => {
  try {
    await initMongoConnection(); // Чекаємо на з'єднання з MongoDB
    setupServer(); // Запускаємо сервер
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
