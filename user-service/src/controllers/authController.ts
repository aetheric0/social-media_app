import { AuthenticatedRequest } from './../middlewares/authMiddleware';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';
import mongoose from 'mongoose';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const accountId = new mongoose.Types.ObjectId().toString();
    const { firstName, lastName, username, email, password, imageUrl} = req.body;

    try {
        const user = new User({ firstName, lastName, username, email, password, accountId, imageUrl });
        await user.save();

        res.status(201).json({ message: 'User created successfully'});
    } catch (err) {
       next(new AppError(`Error during registration: ${err}`,  500));
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<string | any> => {
    const { username, email, password } = req.body;
  
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return next(new AppError('Account does not exist', 500));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Invalid password');
            return next(new AppError('Password is Incorrect', 500));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_SECRET!, {expiresIn: '7d'});

        res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict'});
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict'});
        res.json({ token, refreshToken });
    } catch (err) {
        next (new AppError(`Error during login: ${err}`, 500));
    }
};

export const logout = (req: Request, res: Response): void => {
    res.clearCookie('token', {httpOnly: true, secure: true, sameSite: 'strict'});
    res.clearCookie('refreshToken', {httpOnly: true, secure: true, sameSite: true})
    res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshToken = (req: AuthenticatedRequest, res: Response): void => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token, authorization denied' });
      return;
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as { id: string };
      const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      res.cookie('token', newToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.json({ token: newToken });
    } catch (error) {
      res.status(401).json({ message: `Refresh token is not valid: ${error}` });
    }
  };

export const protectedHandler = (req: AuthenticatedRequest, res: Response): void => {
    res.status(200).json({ message: 'Protected route accessed', user: req.user});
};
