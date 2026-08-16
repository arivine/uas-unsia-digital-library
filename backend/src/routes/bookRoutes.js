import { Router } from 'express';
import { body } from 'express-validator';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validator.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.use(protect);

const bookRules = [
  body('title').notEmpty().withMessage('Judul buku wajib diisi').trim(),
  body('author').notEmpty().withMessage('Penulis wajib diisi').trim(),
  body('category').notEmpty().withMessage('Kategori wajib diisi').trim(),
  body('year')
    .optional({ nullable: true })
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Tahun terbit tidak valid'),
  body('quantity')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('Jumlah eksemplar harus angka >= 0'),
];

router.route('/').get(asyncHandler(getBooks)).post(bookRules, validate, asyncHandler(createBook));

router
  .route('/:id')
  .get(asyncHandler(getBookById))
  .put(bookRules, validate, asyncHandler(updateBook))
  .delete(asyncHandler(deleteBook));

export default router;
