import { Request, Response, NextFunction } from 'express';
import Posts from "../models/Posts";
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import multer from 'multer';
import AppError from '../utils/appError';

const storage = multer.memoryStorage(); // Using memory storage for simplicity, configure as needed
const upload = multer({ storage: storage });

export const createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { caption, location, tags, imageUrl, imageId } = req.body;

    if (!req.user || (typeof req.user !== 'string' && !req.user.id)) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const files = req.files as Express.Multer.File[]; // Ensure req.files is typed correctly
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const file = files[0];
    const userId = req.user.id
    const newPost = new Posts({
      creator: userId,
      caption,
      likes: [],
      location,
      tags: JSON.parse(tags),
      imageUrl,
      imageId,
      date: new Date(),
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    next(new AppError(`Could not create post: ${error}`, 500));
  }
};
