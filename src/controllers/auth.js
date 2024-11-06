import createHttpError from 'http-errors';
import * as authService from '../services/auth.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Завантажуємо змінні оточення
dotenv.config();

// Створюємо транспортер для nodemailer з використанням Brevo (Sendinblue)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await authService.registerUser({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { accessToken, refreshToken } = await authService.loginUser({ email, password });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token provided');
  }

  try {
    const { accessToken } = await authService.refreshSession(refreshToken);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.sendStatus(204);
  }

  try {
    await authService.logoutUser(refreshToken);
    res.clearCookie('refreshToken');
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// Новий метод для відправки email з посиланням для скиду паролю
export const sendResetEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Перевіряємо, чи існує користувач з таким email
    const user = await authService.findUserByEmail(email);
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    // Генеруємо JWT токен для скиду паролю
    const token = await authService.generatePasswordResetToken(email);

    // Формуємо посилання для скиду паролю
    const resetPasswordLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    // Відправляємо email через Brevo (Sendinblue)
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      text: `To reset your password, click the following link: ${resetPasswordLink}`,
      html: `<p>To reset your password, click the following <a href="${resetPasswordLink}">link</a>.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Новий метод для скидання паролю
export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    // Перевіряємо валідність токену
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Шукаємо користувача за email
    const user = await authService.findUserByEmail(decoded.email);
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    // Оновлюємо пароль користувача
    await authService.resetPassword(token, password);

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
