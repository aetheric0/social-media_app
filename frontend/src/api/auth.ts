import apiClient from './apiClient';
import { INewUser, IUpdatePost } from '../lib/types';

export const createUser = async (user: INewUser) => {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const avatarUrl = `https://ui-avatars.com/api/?name=${initials}`;
  const newUser = { ...user, imageUrl: avatarUrl };
  const response = await apiClient.post('/api/auth/register', newUser);
  return response;
};

export const signinAccount = async (user: { username: string, password: string }) => {
  const newUser = { ...user };
  const response = await apiClient.post('/api/auth/login', newUser);
  return response;
}

export const refreshAuthToken = async () => {
  try {
    const response = await apiClient.post('/api/auth/refresh-token');
    localStorage.setItem('token', response.data.token);
    return response.data.token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentUser = await apiClient.get('/api/auth/users/user');
    if (!currentUser) throw new Error("No current user");
    return currentUser.data;
  } catch (error) {
    console.log(error);
  }
}

export const signOutAccount = async () => {
  try {
    const session = await apiClient.post('/api/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return session;
  } catch (error) {
    console.log(error);
  }
}

export const createPost = async (postData: Partial<IUpdatePost>) => {
  const formData = new FormData();

  if (postData.file && postData.file.length > 0) {
    postData.file.forEach((file) => {
      formData.append('file', file);
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
    const response = await apiClient.post('/api/user/create-post', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Create Post Response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating post in API:", error);
    throw error;
  }
};

export const getRecentPosts = async () => {
  const posts = await apiClient.get('/api/user/get-recent-posts');
  if (!posts) throw new Error("No posts found");
  return posts.data;
}

export const likePost = async (postId: string) => {
  try {
    const updatedPost = await apiClient.post('/api/user/like-post', { postId });
    if (!updatedPost) throw new Error("Failed to like post");
    return updatedPost.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const savePost = async (postId: string) => {
  try {
    const updatedPost = await apiClient.post('/api/user/save-post', { post: postId });
    if (!updatedPost) throw new Error("Failed to save post");
    updatedPost.data.postId = postId;
    return updatedPost.data;
  } catch (error) {
    console.log(error);
  }
}

export const getPostById = async (postId: string) => {
  try {
    const post = await apiClient.post('/api/posts/get-post-by-id', { postId });
    return post.data;
  } catch (error) {
    console.log(error);
  }
}

export const updatePost = async (postData: Partial<IUpdatePost>) => {
  console.log('Post Id: ', postData._id);
  const formData = new FormData();
  const hasFileToUpdate = postData && postData.file ? postData.file.length > 0 : null;

  if (hasFileToUpdate) {
    postData.file?.forEach((file) => {
      formData.append('file', file);
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

  try {
    const response = await apiClient.put(`/api/posts/${postData._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Update Post Response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating post in API:", error);
    throw error;
  }
}

export const getInfinitePosts = async ({ pageParam }: { pageParam: number }) => {
  try {
    const queries = await apiClient.get('/api/posts/load-posts', { params: { page: pageParam, limit: 10 } });
    return queries.data;
  } catch (error) {
    console.error('Error in API Call: ', error);
    throw error;
  }
}

export const searchPosts = async (searchTerm: string) => {
  try {
    const posts = await apiClient.post('/api/posts/get-post-by-caption', { searchTerm });
    if (!posts) throw new Error("No posts found");
    return posts.data;
  } catch (error) {
    console.log(error);
  }
}

export const getUsers = async () => {
  try {
    const users = await apiClient.get('/api/auth/users');
    if (!users) throw new Error("No users found");
    return users.data;
  } catch (error) {
    console.log(error);
  }
}

export const getUserById = async (userId: string) => {
  try {
    const user = await apiClient.post(`/api/user/${userId}`, { userId });
    return user.data;
  } catch (error) {
    console.log(error);
  }
}

export const getSaved = async () => {
  try {
    const savedPosts = await apiClient.get('/api/user/saved');
    if (!savedPosts) throw new Error("No saved posts found");
    return savedPosts.data;
  } catch (error) {
    console.log(error);
  }
}
