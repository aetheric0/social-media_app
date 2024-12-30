import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, signinAccount, signOutAccount, createPost, getRecentPosts } from '../api/auth';
import { INewUser, INewPost } from '../lib/types';
import { QUERY_KEYS } from './queryKeys';

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

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  });
}

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })
}