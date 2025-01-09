import express from 'express';
import { register, login, refreshToken, logout, getCurrentUser, getUsers } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout);
router.get('/users', authMiddleware, getUsers);
router.get('/users/user', authMiddleware, getCurrentUser);

export default router;