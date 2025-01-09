import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, refreshAuthToken } from '../api/auth';
import { IContextType, IUser } from '../lib/types';
import axios, { AxiosError } from 'axios';

export const INITIAL_USER: IUser = {
  _id: '',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: '',
  savedPosts: [],
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthUser = async (): Promise<boolean> => {
    try {
      setIsLoading(true); // Set loading to true before API call
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          _id: currentAccount._id,
          firstName: currentAccount.firstName,
          lastName: currentAccount.lastName,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
          savedPosts: currentAccount.savedPosts || [],
        });
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false); // Set loading to false regardless of success/failure
    }
    return false;
  };

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token && location.pathname !== '/sign-up') navigate('/sign-in');

      const verifyToken = async () => { 
        try { 
          await axios.get(
            '/api/auth/users/user', 
            { withCredentials: true }
          ); 
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response && axiosError.response.status === 401) {
            const newToken = await refreshAuthToken(); 
            if (!newToken) { 
              navigate('/sign-in'); 
            } else { 
              await checkAuthUser(); 
            } 
          } 
        }
      };
      verifyToken();
    }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);