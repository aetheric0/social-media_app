import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, signinAccount, signOutAccount, createPost, getRecentPosts, likePost, savePost, getPostById, updatePost, getInfinitePosts, searchPosts, getUsers, getSaved, getUserById } from '../api/auth';
import { INewUser, IUpdatePost } from '../lib/types';
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
    mutationFn: (post: Partial<IUpdatePost>) => createPost(post),
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
      const updatedPostId = data.post._id;

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
    mutationFn: ( postId: string ) => savePost(postId),
    onSuccess: (data) => {
      const updatedPostId = data.postId;
      const updatedUser = data.user;

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
        queryKey: [QUERY_KEYS.GET_CURRENT_USER, updatedUser]
      });
    },
    onError: (error) => {
      console.error('Error saving post: ', error);
    }
  })
}


export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  })

}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: Partial<IUpdatePost>) => updatePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  });
}

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam = 1}) => getInfinitePosts({ pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export const useSearchPosts = (searchTerm: string) => {
  return useQuery ({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  })
}

export const useGetUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: getUsers,
  })
}

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  })

}


export const useGetSaved = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_POSTS],
    queryFn: getSaved,
  })
}