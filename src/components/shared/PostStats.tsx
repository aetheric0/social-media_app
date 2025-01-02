import { useDeleteSavedPost, useLikePost, useSavePost } from "@/hooks/queriesAndMutations";
import { IPost } from "@/lib/types"
import { checkIsLiked } from "@/lib/utils";
//import { useUserContext } from "../../context/AuthProvider"
import React, { useEffect, useState } from "react";

type PostStatsProps = {
    post: IPost;
    userId: string;
}
const PostStats = ( {post, userId }: PostStatsProps ) => {
  const likesList = post.likes;
  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);
  
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavedPost();

useEffect(() => {
//  fetchLikes();
  setLikes(post.likes);
}, [post])

  let newLikes = [...likes];


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
    const newSavedStatus = !isSaved;

    if (newSavedStatus) {
      deleteSavedPost(post._id, {
        onError: (error) => {
          console.error('Error unsaving post: ', error);
          setIsSaved(true);
        } 
      });
    } else {
      savePost({ postId: post._id, userId}, {
        onError: (error) => {
          console.error('Error saving post: ', error);
          setIsSaved(false);
        }
      })
    }
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
        <img 
            src={isSaved 
              ? "/assets/icons/saved.svg"
              : "/assets/icons/save.svg"
              }
            alt="save"
            width={20}
            height={20}
            onClick = { handleSavePost }
            className="cursor-pointer"
        />
      </div>
    </div>
  )
}

export default PostStats;

