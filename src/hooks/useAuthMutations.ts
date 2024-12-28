import { useMutation } from '@tanstack/react-query';
import { createUser, signinAccount, signOutAccount, createPost } from '../api/auth';
import { INewUser, INewPost } from '../lib/types';

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUser(user)
  });
};

export const useSigninAccount = () => {
  return useMutation({
    mutationFn: (user: { username: string, password: string}) => signinAccount(user)
  });
};

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post)
  });
}

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount
  });
};
