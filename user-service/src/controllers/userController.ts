// src/controllers/userControllers.ts
import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Posts from '../models/Posts';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import AppError from '../utils/appError';
import * as fs from 'fs';

// Define the MulterRequest type (in the controller file or a separate types file)
type MulterRequest = AuthenticatedRequest & { file: Express.Multer.File };

export const createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('CreatePost function started')
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    // Type assertion using the alias
    const file = (req as MulterRequest).file;
    if (!file) {
      return next(new AppError('No file uploaded', 400));
    }
    const userId = req.user.id;
    const { caption, location, tags } = req.body;
    console.log("Tags from request body:", tags);
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
      timeout: 60000,
    });
    console.log("Cloudinary Response:", cloudinaryResponse);

    fs.unlinkSync(file.path);
    console.log(`Tags from request body: ${tags}`);
  
    const newPost = new Posts({
      creator: userId,
      caption,
      location,
      tags, // Parse tags to an array
      imageUrl: cloudinaryResponse.secure_url,
      imageId: cloudinaryResponse.public_id,
      date: new Date(),
    });
    console.log("New Post Object:", newPost);
    console.log('Saving new post to database')
    const savePost = await newPost.save();
    res.status(201).json(savePost);
  } catch (error) {
    console.error("Error in createPost:", error);
    next(new AppError('Failed to create post', 500));
  }
};
