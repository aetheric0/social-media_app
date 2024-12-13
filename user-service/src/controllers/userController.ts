import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { Response } from 'express';
import Posts from '../models/Posts';


// Create Post controller
export const CreatePost = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { caption, location, imageUrl, imageId } = req.body;
        console.log('req.user: ', req.user);

        if (!req.user || typeof req.user === 'string') {
            res.status(401).json({ message: 'Unauthorized'});
            return;
        }
        const post = new Posts({
            creator: req.user?.id,
            caption,
            location,
            imageUrl,
            imageId
        });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post', error);
        res.status(500).json({ error: 'Server error' })
    }
};