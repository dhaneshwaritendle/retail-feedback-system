import express from 'express';
const router = express.Router();

import { getDashboardStats, getUsers } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// GET /api/admin/stats
router.get('/stats', protect, admin, getDashboardStats);

// GET /api/admin/users
router.get('/users', protect, admin, getUsers);

export default router;