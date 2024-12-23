export type IUser = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
  };


export interface INewUser {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    imageUrl?: string;
}

export type IContextType = {
    user: IUser;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
}