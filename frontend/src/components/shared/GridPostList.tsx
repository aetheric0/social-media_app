import { IPost } from '@/lib/types'
import { useUserContext } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';
import PostStats from './PostStats';

type GridPostListProps = {
  posts: IPost[];
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
  const { user } = useUserContext();
  
  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post._id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post._id}`} className="grid-post_link">
            <img 
              src={post.imageUrl} 
              alt="post" 
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            { showUser && post.creator && (
              <div className="flex items-center justify-start gap-2">
                <img 
                  src={post.creator.imageUrl} 
                  alt="creator"
                  className="h-8 w-8 rounded-full" 
                />
                <p className="line-clamp-1">{post.creator.firstName}</p>
              </div>
              
            )}
            {showStats && <PostStats post={post} user={user}/>}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default GridPostList
