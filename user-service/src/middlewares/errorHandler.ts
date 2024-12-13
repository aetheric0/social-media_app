import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    console.error('Error:', err);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
    });
};