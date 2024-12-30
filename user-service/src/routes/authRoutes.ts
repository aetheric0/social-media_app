import express from 'express';
import { register, login, protectedHandler, refreshToken, logout, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authMiddleware, protectedHandler);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout);
router.get('/users/user', authMiddleware, getCurrentUser);

export default router;