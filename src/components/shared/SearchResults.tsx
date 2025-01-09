import { IPost } from "@/lib/types";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: IPost
}
const SearchResults = ({ isSearchFetching, searchedPosts}: SearchResultsProps) => {
  if(isSearchFetching) return <Loader />

  if(searchedPosts && searchedPosts.posts.length > 0) {
    return (
      <GridPostList posts={searchedPosts.posts}/>
    )
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full"> No results found</p>
  )
}

export default SearchResults
