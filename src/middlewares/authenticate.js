import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import Session from '../models/session.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createHttpError(401, 'Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const session = await Session.findOne({ userId: decoded.id });
    if (!session || session.accessTokenValidUntil < Date.now()) {
      throw createHttpError(401, 'Access token expired');
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
