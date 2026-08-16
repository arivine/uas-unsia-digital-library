import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validator.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Nama wajib diisi').trim(),
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  ],
  validate,
  asyncHandler(register)
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
    body('password').notEmpty().withMessage('Password wajib diisi'),
  ],
  validate,
  asyncHandler(login)
);

router.get('/me', protect, asyncHandler(getMe));

export default router;
