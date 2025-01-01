import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
<<<<<<< HEAD
import dotenv from 'dotenv';
=======
>>>>>>> d135bf642b49db51106fe9e16b51fd14560b8f4d
import cookieParser from 'cookie-parser'
import { v2 as cloudinary } from 'cloudinary';
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))


app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api/auth', authRoutes);
<<<<<<< HEAD
app.use('/api/auth', userRoutes);
=======
app.use('/api/user', userRoutes);
   
app.use(express.urlencoded({ extended: true }));
>>>>>>> d135bf642b49db51106fe9e16b51fd14560b8f4d

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});