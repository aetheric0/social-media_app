import { Dispatch, SetStateAction } from "react";

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };

  export type IUser = {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
    savedPosts: string[];
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
  };
  
  export type INewPost = {
    caption: string;
    location?: string; // Make file optional
    tags?: string[];
    files: File[];
    creator: string;
};

export type IPost = {
  _id: string;
  caption: string;
  location?: string;
  file: File[]; // Make file optional
  tags?: string[];
  likes: string[];
  imageUrl: string; 
  imageId: string;
  creator: IUser;
  createdAt: string;
  updatedAt: string;
};
  
  export type IUpdatePost = {
    _id: string;
    caption: string;
    imageId: string;
    imageUrl: string;
    file: File[];
    location?: string;
    tags?: string[];
    creator: string;
  };
  

  export type IContextType = {
    user: IUser;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: Dispatch<SetStateAction<IUser>>;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    checkAuthUser:  () => Promise<boolean>;
  };
  
  export type INewUser = {
    firstName:string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  };

export type ISave = {
  _id: string;
  user: string[];
  post: string[];
}