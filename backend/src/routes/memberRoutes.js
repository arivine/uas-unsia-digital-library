import { Router } from 'express';
import { body } from 'express-validator';
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from '../controllers/memberController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validator.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.use(protect);

const memberRules = [
  body('name').notEmpty().withMessage('Nama anggota wajib diisi').trim(),
  body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
];

router.route('/').get(asyncHandler(getMembers)).post(memberRules, validate, asyncHandler(createMember));

router
  .route('/:id')
  .put(memberRules, validate, asyncHandler(updateMember))
  .delete(asyncHandler(deleteMember));

export default router;
