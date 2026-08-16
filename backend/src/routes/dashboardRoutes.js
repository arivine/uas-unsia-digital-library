import { Router } from 'express';
import { getSummary } from '../controllers/dashboardController.js';
import protect from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/summary', protect, asyncHandler(getSummary));

export default router;
