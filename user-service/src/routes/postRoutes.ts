import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from 'express';
import { getPostById, updatePost } from '../controllers/postController';

const router = Router();

router.post('/get-post-by-id', authMiddleware, getPostById);
router.put('/:id', authMiddleware, updatePost);


export default router;