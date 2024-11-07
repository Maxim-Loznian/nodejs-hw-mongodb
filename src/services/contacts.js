import Contact from '../models/contact.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

// Завантажуємо змінні оточення
dotenv.config();

// Налаштовуємо Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Функція для завантаження зображень у Cloudinary
const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    // Перевірка типу файлу (тільки зображення)
    if (!file.mimetype.startsWith('image/')) {
      reject('The file must be an image');
      return;
    }

    // Завантажуємо файл у Cloudinary
    cloudinary.v2.uploader.upload(
      file.path, // Шлях до файлу, якщо він локальний
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary error:', error); // Лог для помилки
          reject(error);
        } else {
          console.log('Cloudinary upload result:', result); // Лог для результату
          resolve(result);
        }
      },
    );
  });
};

// Отримати всі контакти
const getAllContacts = async (
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filterOptions = {},
) => {
  const { type, isFavourite } = filterOptions;

  const query = { userId };

  if (type) {
    query.contactType = type;
  }

  if (isFavourite !== undefined) {
    query.isFavourite = isFavourite === 'true';
  }

  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const contacts = await Contact.find(query)
    .sort(sortOptions)
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalItems = await Contact.countDocuments(query);

  return { contacts, totalItems };
};

// Отримати контакт за ID
const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

// Створити новий контакт
const createContact = async (data) => {
  // Створюємо новий контакт
  const contact = await Contact.create(data);
  return contact;
};

// Оновити контакт
const updateContact = async (data) => {
  // Оновлюємо контакт
  const updatedContact = await Contact.findOneAndUpdate(data);

  return updatedContact;
};

// Видалити контакт
const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};

export {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
