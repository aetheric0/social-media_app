import express from 'express';
import { createPost } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../utils/multer';

const router = express.Router();

router.post('/createPost', authMiddleware, upload.single('file'), createPost);

export default router;