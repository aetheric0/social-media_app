import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ExtendedJwtPayload } from '../../@types/express/index'

export interface AuthenticatedRequest extends Request {
    user?: ExtendedJwtPayload;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied'});
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as ExtendedJwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token validation error: ', err);
        res.status(401).json({ message: 'Token expired, please refresh' });
    }
}