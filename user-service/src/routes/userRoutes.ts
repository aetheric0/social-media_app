import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from 'express';
import { createPost, getRecentPosts, likePost, savePost } from '../controllers/userController';

const router = Router();
router.post('/create-post', authMiddleware, createPost);
router.get('/get-recent-posts', authMiddleware, getRecentPosts);
router.post('/like-post', authMiddleware, likePost);
router.post('/save-post', authMiddleware, savePost);


export default router;