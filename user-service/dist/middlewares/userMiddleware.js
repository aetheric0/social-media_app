"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const appError_1 = __importDefault(require("../utils/appError"));
// Set up multer storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
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
const handleFileUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            return next(new appError_1.default(`Multer upload error: ${err.message}`, 500));
        }
        else if (err) {
            console.error('Unknown upload error:', err);
            return next(new appError_1.default('An unknown error occurred during the file upload.', 500));
        }
        next();
    });
};
exports.handleFileUpload = handleFileUpload;
