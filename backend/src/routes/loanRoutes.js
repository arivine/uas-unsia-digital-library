import { Router } from 'express';
import { body } from 'express-validator';
import { getLoans, createLoan, returnLoan } from '../controllers/loanController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validator.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(asyncHandler(getLoans))
  .post(
    [
      body('member').notEmpty().withMessage('Anggota wajib diisi'),
      body('book').notEmpty().withMessage('Buku wajib diisi'),
      body('dueDate')
        .optional({ nullable: true })
        .isISO8601()
        .withMessage('Format tanggal jatuh tempo tidak valid'),
    ],
    validate,
    asyncHandler(createLoan)
  );

router.put('/:id/return', asyncHandler(returnLoan));

export default router;
