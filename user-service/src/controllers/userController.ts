import { Response, NextFunction } from 'express';
import Posts from "../models/Posts";
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { handleFileUpload } from '../middlewares/userMiddleware'; // Import the middleware
import AppError from '../utils/appError';
import streamifier from 'streamifier'


interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const  createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  handleFileUpload(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    const  files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'No files uploaded.' });
      return;
    }

    try {
      const uploadResults: CloudinaryUploadResult[] = await Promise.all(files.map((file) => {
        return new Promise<CloudinaryUploadResult>((resolve, reject) => {
          console.log('Uploading file to Cloudinary');
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'posts' },
            (error, result?: UploadApiResponse) => {
              if (error) {
                reject(new AppError(`Cloudinary upload failed: ${error.message}`, 500));
              } else if (result) {
                console.log('Cloudinary upload result:', result);
                resolve(result as CloudinaryUploadResult);
              } else {
                reject(new AppError('Cloudinary upload failed: No result', 500));
              }
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      }));

      const { caption, location, tags } = req.body;
      if (req.user) {
        const userId = req.user.id;
        const newPost = new Posts({
        creator: userId,
        caption,
        likes: [],
        location,
        tags: tags,
        imageUrl: uploadResults[0].secure_url,
        imageId: uploadResults[0].public_id,
        date: new Date(),
      });
    
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    }

    } catch (error) {
      next(error);
    }
  });
};

export const getRecentPosts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
      const posts = await Posts.find()
      .sort({date: -1}) // Sort by date in desc order
      .limit(20)
      .populate('creator', 'username firstName imageUrl');

      const formattedPosts = posts.map(post => ({
        ...post,
        createdAt: post.createdAt?.toLocaleString('en-US', { timeZone: 'Africa/Nairobi'}),
        updatedAt: post.updatedAt?.toLocaleString('en-US', { timeZone: 'Africa/Nairobi'})
      }))
    
    res.status(200).json({
      status: 'success',
      results: formattedPosts.length,
      posts,
    });
  } catch(error) {
    next(new AppError(`Error retrieving posts: ${error}`, 500));
  }
};