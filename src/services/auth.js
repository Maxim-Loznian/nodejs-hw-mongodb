const createHttpError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Імпорт моделі користувача
const jwt = require('jsonwebtoken'); // Імпорт JWT

const registerUser = async ({ name, email, password }) => {
  // Перевірка, чи існує користувач з такою електронною поштою
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use'); // Користувач вже існує
  }

  // Хешування пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення нового користувача
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save(); // Збереження нового користувача

  // Повернення нового користувача без пароля
  const userData = newUser.toObject(); // Конвертація в об'єкт
  delete userData.password; // Видаляємо поле з паролем
  return userData; // Повертаємо дані нового користувача
};

// Додайте цю функцію для аутентифікації
const loginUser = async ({ email, password }) => {
  // Знайти користувача за email
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password'); // Користувача не знайдено
  }

  // Перевірка пароля
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password'); // Невірний пароль
  }

  // Генерація токенів
  const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  // Повернення токенів
  return { accessToken, refreshToken };
};

module.exports = { registerUser, loginUser };
