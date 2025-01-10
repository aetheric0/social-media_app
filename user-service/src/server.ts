import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path'; // Import path module
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors';
import postRoutes from './routes/postRoutes';

const app = express();

// Allow CORS for the origin hosting the frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://devlounge.vercel.app'],
  credentials: true,
}));

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);

app.use(express.urlencoded({ extended: true }));

// Handle all other routes by serving the frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
