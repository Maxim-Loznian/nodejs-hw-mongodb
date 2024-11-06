import express from 'express';
import { register, login, refresh, logout, sendResetEmail, resetPassword } from '../controllers/auth.js'; // Додано нові контролери
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

// Маршрути для реєстрації, логіну, рефрешу та логауту
router.post('/register', ctrlWrapper(register));
router.post('/login', ctrlWrapper(login));
router.post('/refresh', ctrlWrapper(refresh));
router.post('/logout', ctrlWrapper(logout));

// Нові маршрути для скиду паролю
router.post('/send-reset-email', ctrlWrapper(sendResetEmail));  // Надсилає лист з токеном
router.post('/reset-password', ctrlWrapper(resetPassword));  // Скидає пароль за токеном

export default router;
