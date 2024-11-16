import pino from 'pino';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import mongoose from 'mongoose';
import multer from 'multer';
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

const logger = pino();

// Налаштовуємо Multer для обробки multipart/form-data
const storage = multer.memoryStorage(); // Зберігаємо файли в пам'яті
const upload = multer({ storage: storage }).single('photo'); // 'photo' — це ім'я поля в формі

// Middleware для завантаження зображень
const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        { resource_type: 'image' }, // Вказуємо, що це зображення
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      )
      .end(file.buffer);
  });
};

// Контролери для роботи з контактами

export const getAllContactsController = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    const filterOptions = { type, isFavourite };
    const { contacts, totalItems } = await getAllContacts(
      userId,
      Number(page),
      Number(perPage),
      sortBy,
      sortOrder,
      filterOptions,
    );
    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: Number(page),
        perPage: Number(perPage),
        totalItems,
        totalPages,
        hasPreviousPage: Number(page) > 1,
        hasNextPage: Number(page) < totalPages,
      },
    });
  } catch (error) {
    logger.error('Error fetching contacts:', error);
    next({ status: 500, message: 'Something went wrong' });
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next({ status: 400, message: 'Invalid contact ID' });
  }

  try {
    const contact = await getContactById(contactId, userId);
    if (!contact) {
      return next({ status: 404, message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    logger.error('Error fetching contact:', error);
    next({ status: 500, message: 'Something went wrong' });
  }
};

export const createContactController = async (req, res, next) => {
  const userId = req.user.id;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    try {
      // Якщо файл є, завантажуємо його в Cloudinary

      const result = await uploadImage(photo);
      photoUrl = result.secure_url;
    } catch (error) {
      console.log('Error creating contact:', error);
      next({ status: 500, message: error.message });
    }
    // });
  }
  console.log(photoUrl);
  const data = { ...req.body, userId, photo: photoUrl };

  // Створюємо новий контакт
  const newContact = await createContact(data);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user.id;
  const photo = req.file; // Отримуємо зображення з запиту
  let photoUrl;

  // Перевірка валідності ID контакту
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next({ status: 400, message: 'Invalid contact ID' });
  }

  try {
    // Якщо є зображення, завантажуємо його в Cloudinary
    if (photo) {
      const result = await uploadImage(photo);
      photoUrl = result.secure_url; // Отримуємо URL зображення після завантаження
    }

    // Підготовка даних для оновлення (якщо фото не було передано, воно залишиться undefined)
    console.log(photoUrl);
    const data = { contactId, ...req.body, userId, photo: photoUrl };

    // Оновлюємо контакт з новими даними
    const updatedContact = await updateContact(data);

    // Якщо контакт не знайдений, повертаємо помилку
    if (!updatedContact) {
      return next({ status: 404, message: 'Contact not found' });
    }

    // Повертаємо відповідь з оновленим контактом
    res.status(200).json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: updatedContact,
    });
  } catch (error) {
    console.log('Error updating contact:', error);
    next({ status: 500, message: error.message });
  }
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next({ status: 400, message: 'Invalid contact ID' });
  }

  try {
    const deletedContact = await deleteContact(contactId, userId);
    if (!deletedContact) {
      return next({ status: 404, message: 'Contact not found' });
    }
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting contact:', error);
    next({ status: 500, message: 'Something went wrong' });
  }
};
