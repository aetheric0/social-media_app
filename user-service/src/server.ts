import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors';
import postRoutes from './routes/postRoutes';


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))


app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
   
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});