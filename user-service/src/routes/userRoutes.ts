import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from 'express';
import { createPost, getRecentPosts } from '../controllers/userController';

const router = Router();
router.post('/create-post', authMiddleware, createPost);
router.get('/get-recent-posts', getRecentPosts);

export default router;