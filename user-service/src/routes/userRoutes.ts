import express from 'express';
import { createPost } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../utils/multer';

const router = express.Router();

router.post('/createPost', authMiddleware, upload.array('files', 5), (req, res, next) => {
    console.log("req.files after multer:", req.files);
    console.log("req.body after multer:", req.body);
    next(); // Important: Call next() to proceed to the controller
}, createPost);

export default router;