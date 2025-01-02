import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, signinAccount, signOutAccount, createPost, getRecentPosts, likePost, savePost, deleteSavedPost, getCurrentUser } from '../api/auth';
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

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ( postId: string ) => likePost(postId),
    onSuccess: (data) => {
      const updatedPostId = data.post._id

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, updatedPostId]
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      });
    },
    onError: (error) => {
      console.error('Error liking post: ', error);
    }
  })
}

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: {postId: string; 
      userId: string;}) => savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      });
    },
    onError: (error) => {
      console.error('Error liking post: ', error);
    }
  })
}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      });
    },
    onError: (error) => {
      console.error('Error liking post: ', error);
    }
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser
  })
}