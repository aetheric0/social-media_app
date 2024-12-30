import Loader from "@/components/shared/Loader";
import { useGetRecentPosts } from "@/hooks/queriesAndMutations";
import { IPost } from "@/lib/types";

const Home = () => {
  const { data: postsData, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();
  const posts = postsData?.data?.posts;

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts ? (
                posts.map((post: IPost) => {
                  console.log('Post:', post); // Log each post for debugging
                  return (
                    <li key={post._id}>
                      <h3>{post.caption}</h3>
                      <p>{post.location}</p>
                    </li>
                  );
                })
              ) : (
                <p>No posts available</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
