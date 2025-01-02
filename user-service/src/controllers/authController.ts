import { AuthenticatedRequest } from './../middlewares/authMiddleware';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';
import mongoose from 'mongoose';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accountId = new mongoose.Types.ObjectId().toString();
    const { firstName, lastName, username, email, password, imageUrl} = req.body;

    try {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            res.status(409).json({ message: 'Username already exists' });
            return;
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            res.status(409).json({message: 'Email already exists'});
            return
        }
        
        const user = new User({ firstName, lastName, username, email, password, accountId, imageUrl });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_SECRET!, {expiresIn: '7d'});

        res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict'});
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict'});
        res.status(201).json({ message: 'User created successfully', token, refreshToken});
    } catch (err) {
       next(new AppError(`Error during registration: ${err}`,  500));
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;
  
    try {
        const existingUser = await User.findOne({ 
            $or: [ 
                { username: username }, 
                { email: username } 
            ]
         }); 
         
        if (!existingUser) {
            console.log('User not found');
            next(new AppError('Account does not exist', 404));
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            console.log('Invalid password');
            next(new AppError('Password is Incorrect', 401));
            return;
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        const refreshToken = jwt.sign({id: existingUser._id}, process.env.REFRESH_SECRET!, {expiresIn: '7d'});

        res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict'});
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict'});
        res.json({ token, refreshToken });
    } catch (err) {
        next (new AppError(`Error during login: ${err}`, 500));
    }
};

export const logout = (req: AuthenticatedRequest, res: Response): void => {
    console.log("Clearing cookies");
    res.clearCookie('token', {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict'});
    res.clearCookie('refreshToken', {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: true});
    console.log("Cookies cleared");
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

  export const getCurrentUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || (typeof req.user !== 'string' && !req.user.id)) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        
        const userId = typeof req.user === 'string' ? req.user: req.user.id;
        const user = await User.findById(userId);

        if(!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            username: user.username,
            email: user.email,
            imageUrl: user.imageUrl,
            bio: user.bio
        });
    } catch (error) {
        next (new AppError(`Could not retrieve current user: ${error}`, 500));
    }
  }

export const protectedHandler = (req: AuthenticatedRequest, res: Response): void => {
    res.status(200).json({ message: 'Protected route accessed', user: req.user});
};
