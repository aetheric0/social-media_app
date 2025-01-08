import { useGetPostById } from "@/hooks/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams()
  const {data: postData, isPending} = useGetPostById(id || '');
  const post = postData?.data.post;
  
  return (
    <div className="post_details-container">
      { isPending ? <Loader /> : (
        <div className="post_details-card">
          <img 
          src={post?.imageUrl} 
          alt="post"
          className="post_details-img" 
          />
           <div className="post_details-info">
            <div className="flex-between w-full">
            <Link to={`/profile/${post?.creator._id}`} className="flex items-center gap-3">
                <img 
                  src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="rounded-full w-12 lg:h-12"
                />
            
          
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                  { post?.creator.firstName }
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                    { multiFormatDateString(post?.createdAt) }
                    </p>
                    <p>   - </p>
                    <p className="subtle-semibold lg:small-regular">
                    { post.location }
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

export default PostDetails;
