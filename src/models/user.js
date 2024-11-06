import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Додаємо токен для скиду паролю
  passwordResetToken: {
    type: String,
    default: null, // Якщо токен не заданий
  },
  // Додаємо час дії токену для скиду паролю
  passwordResetTokenValidUntil: {
    type: Date,
    default: null, // Якщо токен не заданий
  }
});

const User = mongoose.model('User', userSchema);
export default User;
