export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
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
    file: File | null;
    creator: string;
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
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
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