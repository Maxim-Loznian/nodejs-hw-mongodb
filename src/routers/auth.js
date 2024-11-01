const express = require('express');
const { register, login, refresh, logout } = require('../controllers/auth');
const { validateBody } = require('../middlewares/validation');
const { registerSchema, loginSchema } = require('../schemas/auth');
const ctrlWrapper = require('../utils/ctrlWrapper'); // Імпорт функції ctrlWrapper

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(register));
router.post('/login', validateBody(loginSchema), ctrlWrapper(login));
router.post('/refresh', ctrlWrapper(refresh)); // Використання ctrlWrapper
router.post('/logout', ctrlWrapper(logout)); // Використання ctrlWrapper

module.exports = router;
