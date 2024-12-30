import { IPost } from "@/lib/types"
import { multiFormatDateString } from "@/lib/utils";
import { Link } from "react-router-dom";

type PostCardProps = {
    post: IPost;
}

const PostCard = ({ post }: PostCardProps ) => {
  console.log("FirstName", post.creator.firstName)
  return (
    <div className="post-card">
        <div className="flex-betweeen">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${post.creator.id}`}>
                  <img 
                    src={post?.creator?.imageUrl || 'assets/icons/profile-placeholder.svg'}
                    alt="creator"
                    className="rounded-full w-12 lg:h-12"
                  />
                </Link>

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    { post.creator.firstName }
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      { multiFormatDateString(post.createdAt) }
                    </p>
                    <p>
                      -
                    </p>
                    <p className="subtle-semibold lg:small-regular">
                      { post.location }
                    </p>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PostCard
