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
exports.getCurrentUser = exports.getUsers = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = __importDefault(require("../utils/appError"));
const mongoose_1 = __importDefault(require("mongoose"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accountId = new mongoose_1.default.Types.ObjectId().toString();
    const { firstName, lastName, username, email, password, imageUrl } = req.body;
    const formattedUsername = username.toLowerCase();
    try {
        const existingUsername = yield User_1.default.findOne({ username: formattedUsername });
        if (existingUsername) {
            res.status(409).json({ message: 'Username already exists' });
            return;
        }
        const existingEmail = yield User_1.default.findOne({ email });
        if (existingEmail) {
            res.status(409).json({ message: 'Email already exists' });
            return;
        }
        const user = new User_1.default({ firstName, lastName, username: formattedUsername, email, password, accountId, imageUrl });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
        res.status(201).json({ message: 'User created successfully', token, refreshToken });
    }
    catch (err) {
        next(new appError_1.default(`Error during registration: ${err}`, 500));
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const formattedUsername = username.toLowerCase();
    try {
        const existingUser = yield User_1.default.findOne({
            $or: [
                { username: formattedUsername },
                { email: formattedUsername }
            ]
        });
        if (!existingUser) {
            console.log('User not found');
            next(new appError_1.default('Account does not exist', 404));
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            console.log('Invalid password');
            next(new appError_1.default('Password is Incorrect', 401));
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: existingUser._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
        res.json({ token, refreshToken });
    }
    catch (err) {
        next(new appError_1.default(`Error during login: ${err}`, 500));
    }
});
exports.login = login;
const logout = (req, res) => {
    console.log("Clearing cookies");
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: true });
    console.log("Cookies cleared");
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token, authorization denied' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET);
        const newToken = jsonwebtoken_1.default.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', newToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.json({ token: newToken });
    }
    catch (error) {
        res.status(401).json({ message: `Refresh token is not valid: ${error}` });
    }
};
exports.refreshToken = refreshToken;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            users,
        });
    }
    catch (error) {
        next(new appError_1.default(`Error fetching users: ${error}`, 500));
    }
});
exports.getUsers = getUsers;
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const savedPosts = user.savedPosts.map((id) => id.toString());
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            username: user.username,
            email: user.email,
            imageUrl: user.imageUrl,
            bio: user.bio,
            savedPosts,
        });
    }
    catch (error) {
        next(new appError_1.default(`Could not retrieve current user: ${error}`, 500));
    }
});
exports.getCurrentUser = getCurrentUser;
