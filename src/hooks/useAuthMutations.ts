import { useMutation } from '@tanstack/react-query';
import { createUser, signinAccount } from '../api/auth';
import { INewUser } from '../lib/types';

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
