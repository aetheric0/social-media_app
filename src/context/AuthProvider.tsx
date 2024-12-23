import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../api/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { IContextType, IUser } from '../lib/types';
import Cookies from 'js-cookie';

export const INITIAL_USER: IUser = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
}

const INITIAL_STATE: IContextType = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,

}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ( { children }: { children: React.ReactNode } ) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();

            if (currentAccount) {
                setUser({
                    id: currentAccount.id,
                    name: currentAccount.firstName,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                })

                setIsAuthenticated(true);

                return true;
            }

            return false;

        } catch(error) {
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = Cookies.get('token'); 
        if (!token || location.pathname !== '/sign-up') { 
            navigate('/sign-in'); 
        } else { 
            checkAuthUser(); 
        }
    }, [])

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    }

  return (
    <AuthContext.Provider value={value}> 
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
