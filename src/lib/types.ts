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
  imageUrl: string; 
  imageId: string;
  creator: IUser;
  createdAt: string;
  updatedAt: string;
};
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
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

  export interface PostData { // This is what the frontend deals with
    creator: string;
    caption: string;
    location?: string;
    tags?: string[];
    imageUrl: string[];
    imageId: string[];
    date?: Date;
}