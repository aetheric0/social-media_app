import express from 'express';
import { register, login, protectedHandler, refreshToken, logout, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createPost } from '../controllers/userController';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/createPost', authMiddleware, upload.array('file'), createPost);
router.post('/register', register);
router.post('/login', login);
router.get('/protected', authMiddleware, protectedHandler);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout);
router.get('/users/user', authMiddleware, getCurrentUser);

export default router;