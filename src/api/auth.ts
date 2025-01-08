import axios from 'axios';
import { INewUser, IUpdatePost } from '../lib/types';


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
        postData.tags.forEach((tag) => formData.append('tags', tag)); // Append each tag individually
    }

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

export async function likePost(postId: string) {
  try {
    const updatedPost = await axios.post('http://localhost:5000/api/user/like-post',
    {
      postId,
    },
  {withCredentials: true})
  if (!updatedPost) throw Error;
  
  return updatedPost.data;
  } catch(error) {
    console.log(error);
    throw error;
  }
}

export async function savePost(postId: string) {
  try {
    const updatedPost = await axios.post('http://localhost:5000/api/user/save-post',
    {
      post: postId,
    },
  {withCredentials: true})
  if (!updatedPost) throw Error;
  updatedPost.data.postId = postId

  return updatedPost.data;
  } catch(error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  
  try {
    const post = await axios.post(
      'http://localhost:5000/api/posts/get-post-by-id',
      { postId },
      { withCredentials: true },
    );
    return post;
  } catch(error) {
    console.log(error);
  }
}

export async function updatePost(postData: Partial<IUpdatePost>) {
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
    postData.tags.forEach((tag) => formData.append('tags', tag)); // Append each tag individually
  }

  try {
      const response = await axios.put(`http://localhost:5000/api/posts/${postData._id}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
      });
      console.log('Update Post Response:', response.data);
      return response.data;
  } catch (error) {
      console.error("Error creating post in API:", error);
      throw error;
  }
}

export async function getInfinitePosts({ pageParam }: {pageParam: number}) {
  try {
    const queries = await axios.get(
      'http://localhost:5000/api/posts/load-posts',
      { params: {page: pageParam, limit: 10 }, 
      withCredentials: true,
    });
    console.log('API Response: ', queries.data);
    return queries.data;
  } catch(error) {
    console.error('Error in API Call: ', error);
    throw error;
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await axios.post(
      'http://localhost:5000/api/posts/get-post-by-caption',
      { searchTerm },
      { withCredentials: true},
    )
    if (!posts) throw Error;

    return posts;
  } catch(error) {
    console.log(error);
  }
}
