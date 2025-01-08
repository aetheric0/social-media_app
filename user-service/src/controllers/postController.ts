import { Response, NextFunction } from 'express';
import Posts from "../models/Posts";
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { v2 as cloudinary } from 'cloudinary';
import { handleFileUpload } from '../middlewares/userMiddleware'; // Import the middleware
import AppError from '../utils/appError';
import { Readable } from 'stream';



interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

interface UpdatedFields {
  caption?: string;
  location?: string;
  tags?: string[];
  imageUrl?: string;
  imageId?: string;
}


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getPostById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  console.log('Request Body: ', req.body);  
  const { postId }  = req.body;
  
    try {
      const post = await Posts.findById(postId).populate('creator', '_id username firstName imageUrl');
      if (!post) {
        res.status(404).json( {message: 'Could not find post' });
        return;
      }
      res.status(200).json({
        post,
      })
    } catch(error) {
      next(new AppError(`Error retrieving post: ${error}`, 500)); 
    } 
  }

export const updatePost = [
    handleFileUpload,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const postId = req.params.id;
        const { caption, location, tags } = req.body;
        const files = req.files as Express.Multer.File[];
        const updatedFields: UpdatedFields = { caption, location, tags };
  
        if (files && files.length > 0) {
          const uploadResults: CloudinaryUploadResult[] = await Promise.all(files.map(((file) => {
            return new Promise<CloudinaryUploadResult>((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream({ folder: 'posts' }, (error, result) => {
                if (error) {
                  reject(new AppError(`Cloudinary upload failed: ${error.message}`, 500));
                } else if (result) {
                  console.log('Cloudinary upload result:', result);
                  resolve(result as CloudinaryUploadResult);
                } else {
                  reject(new AppError('Cloudinary upload failed: No result', 500));
                }
              });
  
              // Convert buffer to stream and pipe it to Cloudinary
              const bufferStream = new Readable();
              bufferStream.push(file.buffer);
              bufferStream.push(null);
              bufferStream.pipe(stream);
            });
          })
        ));
          // Assuming a single image, you can adapt this for multiple images if needed
          const imageUrl = uploadResults[0].secure_url;
          const imageId = uploadResults[0].public_id;
  
          // Assuming you want to delete the old image from Cloudinary
          const post = await Posts.findById(postId);
          if (post?.imageId) {
            await cloudinary.uploader.destroy(post.imageId);
          }
  
          updatedFields.imageUrl = imageUrl;
          updatedFields.imageId = imageId;
        }
  
        const updatedPost = await Posts.findByIdAndUpdate(postId, updatedFields, { new: true });
        if (!updatedPost) {
          res.status(404).json({ message: 'Post not found' });
          return;
        }
  
        res.status(200).json({ status: 'success', post: updatedPost });
      } catch (error) {
        next(new AppError(`Error updating post: ${error}`, 500));
      }
    }
  ];

export const getInfinitePosts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit =  10} = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const posts = await Posts.find()
      .skip(skip)
      .limit(Number(limit))
      .populate('creator');

    const totalPosts = await Posts.countDocuments();

    res.status(200).json({
      status: 'success',
      results: posts.length,
      posts,
      totalPosts,
      currentPage: Number(page),
      totalPages: Math.ceil((totalPosts / Number(limit)))
    });
  } catch(error) {
    next(new AppError(`Error fetching posts: ${error}`, 500));
  }
}