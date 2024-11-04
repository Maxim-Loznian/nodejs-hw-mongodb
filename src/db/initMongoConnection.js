import mongoose from 'mongoose';
import pino from 'pino';

const logger = pino();

const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
    const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    logger.info('Mongo connection successfully established!');
  } catch (error) {
    logger.error('Mongo connection failed:', error.message);
    process.exit(1);
  }
};

export default initMongoConnection;
