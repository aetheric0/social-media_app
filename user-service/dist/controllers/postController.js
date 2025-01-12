"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostByCaption = exports.getInfinitePosts = exports.updatePost = exports.getPostById = void 0;
const Posts_1 = __importDefault(require("../models/Posts"));
const cloudinary_1 = require("cloudinary");
const userMiddleware_1 = require("../middlewares/userMiddleware"); // Import the middleware
const appError_1 = __importDefault(require("../utils/appError"));
const stream_1 = require("stream");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const getPostById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    try {
        const post = yield Posts_1.default.findById(postId).populate('creator', '_id username firstName imageUrl');
        if (!post) {
            res.status(404).json({ message: 'Could not find post' });
            return;
        }
        res.status(200).json({
            post,
        });
    }
    catch (error) {
        next(new appError_1.default(`Error retrieving post: ${error}`, 500));
    }
});
exports.getPostById = getPostById;
exports.updatePost = [
    userMiddleware_1.handleFileUpload,
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const postId = req.params.id;
            const { caption, location, tags } = req.body;
            const files = req.files;
            const updatedFields = { caption, location, tags };
            if (files && files.length > 0) {
                const uploadResults = yield Promise.all(files.map(((file) => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'posts' }, (error, result) => {
                            if (error) {
                                reject(new appError_1.default(`Cloudinary upload failed: ${error.message}`, 500));
                            }
                            else if (result) {
                                console.log('Cloudinary upload result:', result);
                                resolve(result);
                            }
                            else {
                                reject(new appError_1.default('Cloudinary upload failed: No result', 500));
                            }
                        });
                        // Convert buffer to stream and pipe it to Cloudinary
                        const bufferStream = new stream_1.Readable();
                        bufferStream.push(file.buffer);
                        bufferStream.push(null);
                        bufferStream.pipe(stream);
                    });
                })));
                // Assuming a single image, you can adapt this for multiple images if needed
                const imageUrl = uploadResults[0].secure_url;
                const imageId = uploadResults[0].public_id;
                // Assuming you want to delete the old image from Cloudinary
                const post = yield Posts_1.default.findById(postId);
                if (post === null || post === void 0 ? void 0 : post.imageId) {
                    yield cloudinary_1.v2.uploader.destroy(post.imageId);
                }
                updatedFields.imageUrl = imageUrl;
                updatedFields.imageId = imageId;
            }
            const updatedPost = yield Posts_1.default.findByIdAndUpdate(postId, updatedFields, { new: true });
            if (!updatedPost) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
            res.status(200).json({ status: 'success', post: updatedPost });
        }
        catch (error) {
            next(new appError_1.default(`Error updating post: ${error}`, 500));
        }
    })
];
const getInfinitePosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const posts = yield Posts_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('creator', '_id username firstName imageUrl');
        const totalPosts = yield Posts_1.default.countDocuments();
        res.status(200).json({
            status: 'success',
            results: posts.length,
            posts,
            totalPosts,
            currentPage: Number(page),
            totalPages: Math.ceil((totalPosts / Number(limit)))
        });
    }
    catch (error) {
        next(new appError_1.default(`Error fetching posts: ${error}`, 500));
    }
});
exports.getInfinitePosts = getInfinitePosts;
const getPostByCaption = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = req.body;
        if (!searchTerm) {
            res.status(400).json({ status: 'fail', message: 'Search term is required' });
            return;
        }
        const posts = yield Posts_1.default.find({ caption: { $regex: searchTerm, $options: 'i' } }).populate('creator', '_id username firstName imageUrl');
        res.status(200).json({
            status: 'success',
            results: posts.length,
            posts
        });
    }
    catch (error) {
        next(new appError_1.default(`Error fetching posts by caption: ${error}`, 500));
    }
});
exports.getPostByCaption = getPostByCaption;
