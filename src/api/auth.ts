import axios from 'axios';
import { INewUser, INewPost } from '../lib/types';

export const createUser = async (user: INewUser) => {
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    const avatarUrl = `https://ui-avatars.com/api/?name=${initials}`;
    const newUser = { ...user, imageUrl: avatarUrl };
    
    const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        newUser,
        { withCredentials: true }
    );
    
    return response;
};

export const signinAccount = async (user: { username: string, password: string }) => {
    const newUser = { ...user };
    
    const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        newUser,
        { withCredentials: true }
    );
    
    return response;
};

export async function getCurrentUser() {
    try {
        const currentUser = await axios.get(
            "http://localhost:5000/api/auth/users/user",
            { withCredentials: true }
        );

        if (!currentUser) throw new Error("User not found");
        
        return currentUser.data;
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        const session = await axios.post(
            "http://localhost:5000/api/auth/logout",
            {},
            { withCredentials: true }
        );

        localStorage.removeItem('token');
        return session;
    } catch (error) {
        console.log(error);
    }
}

export const createPost = async (postData: INewPost) => {
    const formData = new FormData();

    postData.files?.forEach((file, index) => {
        console.log(`Appending file ${index}:`, file.name, file);
        formData.append("files", file);
    });

    if (postData.files && postData.files.length > 0) {
        postData.files.forEach((fileSize) => {
            formData.append('file', files);
        });
    }

    if (postData.caption) {
        formData.append('caption', postData.caption);
    }

    if (postData.location) {
        formData.append('location', postData.location);
    }

    if (postData.tags) {
        postData.tags.forEach((tag) => formData.append('tags', tag));
    }

    if (postData.creator) {
        formData.append('creator', postData.creator);
    }

    try {
        const response = await axios.post(
            'http://localhost:5000/api/posts/create',
            formData,
            { 
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            }
        );

        console.log('Create Post Response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating post in API:", error);
        throw error;
    }
};

export async function getRecentPosts() {
    const posts = await axios.get(
        'http://localhost:5000/api/user/get-recent-posts',
        { withCredentials: true }
    );

    if (!posts) throw new Error("Posts not found");

    return posts;
}