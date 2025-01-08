import { IPost } from '@/lib/types'
import { useUserContext } from '../../context/AuthProvider';

type GridPostListProps = {
  posts: IPost[];
}

const GridPostList = ({ posts }: GridPostListProps) => {
  const { user } = useUserContext();
  
  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post._id} className="relative min-w-80 h-80">
          {post.caption}
        </li>
      ))}
    </ul>
  )
}

export default GridPostList
