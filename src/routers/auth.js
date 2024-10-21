const express = require('express');
const { register, login, refresh, logout } = require('../controllers/auth');
const { validateBody } = require('../middlewares/validation');
const { registerSchema, loginSchema } = require('../schemas/auth');

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
