import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Correct: null for no error, true to accept
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and SVG are allowed.')); // Correct: Only the error object
        }
    },
});