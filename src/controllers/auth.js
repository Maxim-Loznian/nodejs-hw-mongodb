const User = require('../models/user');
const Session = require('../models/session');
const createHttpError = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    await Session.deleteMany({ userId: user._id }); // Видалити стару сесію
    const newSession = new Session({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: Date.now() + 15 * 60 * 1000, // 15 хвилин
      refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    await newSession.save();

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token provided');
  }

  try {
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.sendStatus(204);
  }

  try {
    await Session.deleteMany({ refreshToken });
    res.clearCookie('refreshToken');
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
