import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from 'express';
import { getInfinitePosts, getPostByCaption, getPostById, updatePost } from '../controllers/postController';

const router = Router();

router.post('/get-post-by-id', authMiddleware, getPostById);
router.put('/:id', authMiddleware, updatePost);
router.get('/load-posts', authMiddleware, getInfinitePosts);
router.post('/get-post-by-caption', authMiddleware, getPostByCaption);


export default router;