<<<<<<< HEAD
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
=======
import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from 'express';
import { createPost, getRecentPosts } from '../controllers/userController';

const router = Router();
router.post('/create-post', authMiddleware, createPost);
router.get('/get-recent-posts', getRecentPosts);
>>>>>>> d135bf642b49db51106fe9e16b51fd14560b8f4d

export default router;