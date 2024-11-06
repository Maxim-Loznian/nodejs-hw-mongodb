import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenValidUntil: {
    type: Date,
    required: true,
  },
  refreshTokenValidUntil: {
    type: Date,
    required: true,
  },
  // Додаємо токен для скиду паролю
  passwordResetToken: {
    type: String, // Для зберігання токену скиду паролю
    default: null,
  },
  // Додаємо час дії токену для скиду паролю
  passwordResetTokenValidUntil: {
    type: Date, // Для зберігання часу дії токену скиду паролю
    default: null,
  }
}, { timestamps: true, versionKey: false });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
