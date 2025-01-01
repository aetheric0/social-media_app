import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    console.log(`Received file field: ${file.fieldname}`);
    cb(null, true);
  }
}).array('file', 10); // Accept multiple files

// Middleware to handle file upload
export const handleFileUpload = (req: Request, res: Response, next: NextFunction) => {

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(new AppError(`Multer upload error: ${err.message}`, 500));
    } else if (err) {
        console.error('Unknown upload error:', err); 
        return next(new AppError('An unknown error occurred during the file upload.', 500));
    }
    next();
  });
};
