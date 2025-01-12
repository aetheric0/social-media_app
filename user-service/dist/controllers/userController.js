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
exports.getUserById = exports.getSaved = exports.savePost = exports.likePost = exports.getRecentPosts = exports.createPost = void 0;
const Posts_1 = __importDefault(require("../models/Posts"));
const cloudinary_1 = require("cloudinary");
const userMiddleware_1 = require("../middlewares/userMiddleware"); // Import the middleware
const appError_1 = __importDefault(require("../utils/appError"));
const streamifier_1 = __importDefault(require("streamifier"));
const User_1 = __importDefault(require("../models/User"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, userMiddleware_1.handleFileUpload)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(err);
        }
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ message: 'No files uploaded.' });
            return;
        }
        try {
            const uploadResults = yield Promise.all(files.map((file) => {
                return new Promise((resolve, reject) => {
                    console.log('Uploading file to Cloudinary');
                    const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: 'posts' }, (error, result) => {
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
                    streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
                });
            }));
            const { caption, location, tags } = req.body;
            if (req.user) {
                const userId = req.user.id;
                const newPost = new Posts_1.default({
                    creator: userId,
                    caption,
                    likes: [],
                    location,
                    tags: tags,
                    imageUrl: uploadResults[0].secure_url,
                    imageId: uploadResults[0].public_id,
                    date: new Date(),
                });
                const savedPost = yield newPost.save();
                res.status(201).json(savedPost);
            }
        }
        catch (error) {
            next(error);
        }
    }));
});
exports.createPost = createPost;
const getRecentPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Posts_1.default.find()
            .sort({ createdAt: -1 }) // Sort by date in desc order
            .limit(20)
            .populate('creator', 'username firstName imageUrl');
        const formattedPosts = posts.map(post => {
            var _a, _b;
            return (Object.assign(Object.assign({}, post), { createdAt: (_a = post.createdAt) === null || _a === void 0 ? void 0 : _a.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }), updatedAt: (_b = post.updatedAt) === null || _b === void 0 ? void 0 : _b.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }) }));
        });
        res.status(200).json({
            status: 'success',
            results: formattedPosts.length,
            posts,
        });
    }
    catch (error) {
        next(new appError_1.default(`Error retrieving posts: ${error}`, 500));
    }
});
exports.getRecentPosts = getRecentPosts;
const likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const post = yield Posts_1.default.findById(postId);
        const user = yield User_1.default.findById(userId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        post.likes = post.likes.filter(_id => _id !== null);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const likesArray = post.likes.includes(user._id)
            ? post.likes.filter(_id => _id.toString() !== (user === null || user === void 0 ? void 0 : user._id.toString())) : [...post.likes, user.id];
        post.likes = likesArray;
        yield post.save();
        res.status(200).json({
            status: 'success',
            post,
        });
    }
    catch (error) {
        next(new appError_1.default(`Error liking post: ${error}`, 500));
    }
});
exports.likePost = likePost;
const savePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { post: postId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const post = yield Posts_1.default.findById(postId);
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.savedPosts = user.savedPosts.filter(_id => _id !== null);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        const savedPostsArray = user.savedPosts.includes(post._id)
            ? user.savedPosts.filter(_id => _id.toString() !== postId) : [...user.savedPosts, post._id];
        user.savedPosts = savedPostsArray;
        const stringPostArray = savedPostsArray.map(_id => _id.toString());
        yield user.save();
        res.status(200).json({
            status: 'success',
            user,
            savedPosts: stringPostArray,
        });
    }
    catch (error) {
        next(new appError_1.default(`Error saving post: ${error}`, 500));
    }
});
exports.savePost = savePost;
const getSaved = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || (typeof req.user !== 'string' && !req.user.id)) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const userId = typeof req.user === 'string' ? req.user : req.user.id;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const savedPosts = user.savedPosts;
        const saves = [];
        for (const save of savedPosts) {
            const post = yield Posts_1.default.findById(save.toString()).populate('creator', '_id imageUrl');
            saves.push(post);
        }
        res.status(200).json({
            status: 'success',
            results: saves.length,
            saves,
        });
    }
    catch (error) {
        next(new appError_1.default(`Error fetching posts by caption: ${error}`, 500));
    }
});
exports.getSaved = getSaved;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const user = yield User_1.default.findById(userId);
        const userPosts = yield Posts_1.default.find({ creator: user === null || user === void 0 ? void 0 : user._id.toString() });
        if (!user) {
            res.status(404).json({ message: 'Could not find post' });
            return;
        }
        res.status(200).json({
            user,
            userPosts,
        });
    }
    catch (error) {
        next(new appError_1.default(`Error retrieving post: ${error}`, 500));
    }
});
exports.getUserById = getUserById;
