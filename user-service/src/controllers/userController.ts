// src/controllers/userControllers.ts
import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Posts from '../models/Posts';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import AppError from '../utils/appError';
import * as fs from 'fs';

// Define the MulterRequest type (in the controller file or a separate types file)
type MulterRequest = AuthenticatedRequest & { files: Express.Multer.File[] };

export const createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('CreatePost function started');

    if (!req.user) {
      console.log('Unauthorized access');
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    console.log('User authenticated');

    // Type assertion using the alias
    const files = (req as MulterRequest).files;

    if (!files || files.length === 0) {
      console.log('No files uploaded');
      return next(new AppError('No files uploaded', 400));
    }

    console.log('Files uploaded:', files.map(file => file.originalname));

    const userId = req.user.id;
    const { caption, location, tags } = req.body;

    // Log the tags for debugging purposes
    console.log(`Tags from request body: ${tags}`);

    const uploadedImages = await Promise.all(files.map(async (file) => {
      console.log(`Uploading file ${file.originalname} to Cloudinary`);
      const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
        timeout: 60000,
      });
      console.log(`Uploaded file ${file.originalname} to Cloudinary with URL ${cloudinaryResponse.secure_url}`);
      fs.unlinkSync(file.path); // Clean up the uploaded file from local storage
      return {
        secure_url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      };
    }));

    const imageUrls = uploadedImages.map(image => image.secure_url);
    const imageIds = uploadedImages.map(image => image.public_id);

    const newPost = new Posts({
      creator: userId,
      caption,
      location,
      tags, // Use the parsed tags array
      imageUrl: imageUrls,
      imageId: imageIds,
      date: new Date(),
    });

    console.log('Saving new post to database');
    const savedPost = await newPost.save();
    console.log('Post saved:', savedPost);

    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error in createPost:', error);
    next(new AppError('Failed to create post', 500));
  }
};
