import { Router } from 'express';
import { register, login, protectedHandler, refreshToken, logout, getCurrentUser } from '../controllers/authController'
import { authMiddleware } from '../middlewares/authMiddleware';
import { CreatePost } from '../controllers/userController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authMiddleware, protectedHandler);
router.post('/refresh-token', refreshToken);
router.post('/create-post', authMiddleware, CreatePost);
router.post('/logout', authMiddleware, logout);
router.get('/users/user', authMiddleware, getCurrentUser);

export default router;