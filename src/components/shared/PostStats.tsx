import {  useLikePost, useSavePost } from "@/hooks/queriesAndMutations";
import { IPost, IUser } from "@/lib/types"
import { checkIsLiked, checkIsSaved } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";

type PostStatsProps = {
    post: IPost;
    user: IUser;
}
const PostStats = ( {post, user }: PostStatsProps ) => {
  const likesList = post.likes;
  const postId = post._id.toString();
  const userId = user._id.toString();
  const [likes, setLikes] = useState(likesList);

  const savedList = user.savedPosts;
  const [saved, setSaved] = useState(savedList);
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isToggling } = useSavePost();

useEffect(() => {
//  fetchLikes();
  setLikes(post.likes);
  setSaved(user.savedPosts);
}, [post, user])


  let newLikes = [...likes];
  let newSaves = [...saved];


  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
  
    const hasLiked = newLikes.includes(userId);
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost(post._id);
  }

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    const hasSaved = newSaves.includes(postId);
    if (hasSaved) {
      newSaves = newSaves.filter((id) => id !== postId);
    } else {
      newSaves.push(postId);
    }
    user.savedPosts = newSaves;
    setSaved(newSaves);
    console.log('newSaves: ', newSaves);
    savePost(post._id);
  }
  

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img 
            src={checkIsLiked(likes, userId) 
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
              }
            alt="like"
            width={20}
            height={20}
            onClick = { handleLikePost }
            className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{ likes.length }</p>
      </div>
      <div className="flex gap-2 mr-5">
        { isToggling ? <Loader /> : <img 
            src={checkIsSaved(saved, postId)
              ? "/assets/icons/saved.svg"
              : "/assets/icons/save.svg"
              }
            alt="save"
            width={20}
            height={20}
            onClick = { handleSavePost }
            className="cursor-pointer"
        /> }
      </div>
    </div>
  )
}

export default PostStats;

