import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useGetRecentPosts, useGetUsers } from "@/hooks/queriesAndMutations";
import { IPost, IUser } from "@/lib/types";

const Home = () => {
  const { data: postsData, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();
  const posts = postsData?.data?.posts;

  const {data: usersData, isLoading: isUserLoading, isError: isErrorUsers} = useGetUsers();
  const users = usersData?.data?.users

  if (isErrorPosts || isErrorUsers) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">For some Reason Feed Could Not Be Retrieved. You Might want to Refresh or Try Again Later</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Top Creators Could Not Be Retrieved. An Unknown Error Occured.</p>
        </div>
      </div>
    );
  }

  return ( 
    <div className="flex flex-1"> 
      <div className="home-container"> 
        <div className="home-posts"> 
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2> 
            { isPostLoading && !posts ? ( 
              <Loader /> 
            ) : ( 
              <ul className="flex flex-col flex-1 gap-9 w-full"> 
                { posts ? ( posts.map((post: IPost) => ( 
                  <PostCard post={post} key={post.caption}/>
                )) ) : 
                  ( <p>No posts available</p> )
                } 
              </ul> 
            )} 
        </div> 
      </div> 
      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !users ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {users.map((user: IUser) => (
              <li key={user._id}>
                <UserCard user={user} />
              </li>
            ))}
          </ul>
        )
      }

      </div>
    </div> 
  ); 
}; 

    export default Home;