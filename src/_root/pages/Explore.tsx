import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import { useGetPosts } from "@/hooks/queriesAndMutations";
import { IPost } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

const Explore = () => {
  const [searchValue, setSearchValue] = useState('');

  const { data: postsData, fetchNextPage, hasNextPage} = useGetPosts();

  const posts = postsData?.pages;

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }
  })

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )
  }
  console.log('posts: ', posts);

  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResults && posts
    .every((item) => item.posts.length === 0)
  
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img 
          src="/assets/icons/search.svg" 
          width={24}
          height={24}
          alt="search" />
          <Input 
          type="text"
          placeholder="Search"
          className="explore-search"
          value={searchValue}
          onChange={ (e) => setSearchValue(e.target.value)}
           />
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold"> Popular Today </h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img 
          src="/assets/icons/filter.svg"
          width={20}
          height={20} 
          alt="filter" 
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        { shouldShowSearchResults ? (
          <SearchResults 
          
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full"> End of posts</p>
        ) : posts.map((item, pageIndex) => (
          item.posts.map((post: IPost, postIndex: number) => {
            if (pageIndex === posts.length - 1 && postIndex === item.posts.length - 1) {
              return (
                <div ref={lastPostElementRef} key={post._id}>
                  <GridPostList posts={[post]} />
                </div>
              );
            }
            return <GridPostList key={post._id} posts={posts} />
          })
        ))}
      </div>
    </div>
  )
};


export default Explore;
