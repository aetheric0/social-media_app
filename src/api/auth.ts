import axios from 'axios';
import { INewUser, INewPost } from '../lib/types';

export const createUser = async (user: INewUser) => {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const avatarUrl = `https://ui-avatars.com/api/?name=${initials}`;
  const newUser = { ...user, imageUrl: avatarUrl };
  const response = await axios.post(
    "http://localhost:5000/api/auth/register",
    newUser, { withCredentials: true }
  );
  return response;
};

export const signinAccount = async (user: {username: string, password: string}) => {
  const newUser = { ...user };
  const response = await axios.post(
    "http://localhost:5000/api/auth/login",
    newUser, { withCredentials: true }
  );
  return response;
}

export async function getCurrentUser() {
  try {
    const currentUser = await axios.get(
      "http://localhost:5000/api/auth/users/user", 
      { 
        withCredentials: true
      }
    );
    if (!currentUser) throw Error;
    return currentUser.data;

  } catch(error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await axios.post(
      "http://localhost:5000/api/auth/logout",
      {}, 
      {
        withCredentials: true
      }
    );
    localStorage.removeItem('token');

    return session;

  } catch(error) {
    console.log(error);
  }
}

export const createPost = async (postData: INewPost) => {
  const formData = new FormData();

  postData.files?.forEach((file, index) => {
    console.log(`Appending file ${index}:`, file.name, file);
    formData.append("files", file);
  });

<<<<<<< HEAD
  // Log FormData contents
  for (let pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }
=======
    if (postData.file && postData.file.length > 0) {
        postData.file.forEach((file) => {
            formData.append('file', file);
        });
    }
>>>>>>> d135bf642b49db51106fe9e16b51fd14560b8f4d

  if (postData.caption) {
    formData.append('caption', postData.caption);
  }

  if (postData.location) {
    formData.append('location', postData.location);
  }

  if (postData.tags) {
    postData.tags.forEach((tag) => formData.append('tags', tag));
  }

<<<<<<< HEAD
  if (postData.creator) {
    formData.append('creator', postData.creator);
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/createPost',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating post in API:", error);
    throw error;
  }
};
=======
    if (postData.creator) {
        formData.append('creator', postData.creator);
    }
 
    try {
        const response = await axios.post('http://localhost:5000/api/user/create-post', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
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
    { withCredentials: true}
  );

  if (!posts) throw Error;

  return posts
}
>>>>>>> d135bf642b49db51106fe9e16b51fd14560b8f4d
