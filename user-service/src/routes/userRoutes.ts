import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from 'express';
import { createPost } from '../controllers/userController';

const router = Router();
router.post('/create-post', authMiddleware, createPost);

export default router;