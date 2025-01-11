import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB connected')
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;