import express from 'express';
import multer from 'multer'; // Для завантаження файлів
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import authenticate from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

// Налаштування multer для обробки завантажень файлів
const storage = multer.memoryStorage(); // Файли будуть зберігатися в пам'яті
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Обмеження на розмір файлу (5MB)
  fileFilter: (req, file, cb) => {
    // Перевірка типу файлу (тільки зображення)
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('The file must be an image'));
    }
    cb(null, true);
  },
});

// Створення маршруту
const router = express.Router();

// Використовуємо middleware для аутентифікації для всіх маршрутів
router.use(authenticate);

// Маршрути для роботи з контактами
router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));

// Для створення контакту використовуємо multer для обробки файлів
router.post('/', upload.single('photo'), ctrlWrapper(createContactController));

// Для оновлення контакту, також підтримуємо можливість додавати нове фото
router.patch('/:contactId', upload.single('photo'), ctrlWrapper(updateContactController));

// Можна оновлювати або додавати фото через PUT (якщо потрібно замінити весь контакт)
router.put('/:contactId', upload.single('photo'), ctrlWrapper(updateContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
