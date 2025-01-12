"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        const error = err;
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const refreshDecoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET);
                const newToken = jsonwebtoken_1.default.sign({ id: refreshDecoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('token', newToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });
                req.user = jsonwebtoken_1.default.decode(newToken);
                next();
            }
            catch (refreshErr) {
                console.error('Refresh token validation error:', refreshErr);
                res.status(401).json({ message: 'Token expired, please log in again' });
                return;
            }
        }
        else {
            res.status(401).json({ message: 'Token expired, please refresh' });
            return;
        }
    }
};
exports.authMiddleware = authMiddleware;
