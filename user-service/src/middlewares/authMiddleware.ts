import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ExtendedJwtPayload } from '../../@types/express/index'

export interface AuthenticatedRequest extends Request {
    user?: ExtendedJwtPayload;
}

interface JwtError extends JwtPayload {
    name: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

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

        const error = err as JwtError;

        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { id: string }; 
                const newToken = jwt.sign({ id: refreshDecoded.id }, process.env.JWT_SECRET!, { expiresIn: '1h' }); 
                res.cookie('token', newToken, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production', 
                    sameSite: 'strict' 
                }); 
                req.user = jwt.decode(newToken) as ExtendedJwtPayload;
                next();
            } catch (refreshErr) {
                console.error('Refresh token validation error:', refreshErr);
                res.status(401).json({ message: 'Token expired, please log in again' });
            }
        }
        res.status(401).json({ message: 'Token expired, please refresh' });
    }
}