import express from 'express';
const router = express.Router();

import { registerUser, loginUser } from '../controllers/userController.js';

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

export default router;