"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, _next) => {
    console.error('Error:', err);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
    });
};
exports.errorHandler = errorHandler;
