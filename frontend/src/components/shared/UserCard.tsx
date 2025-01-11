import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { IUser } from '@/lib/types';

type UserCardProps = {
    user: IUser;
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/profile/${user._id}`} className="user-card">
        <img 
            src={user.imageUrl} 
            alt="user"
            className="rounded-full w-14 h-14" 
        />

        <div className="flex-center flex-col gap1">
            <p className="base-medium text-light-1 text-center line-clamp-1">{user.firstName}</p>
            <p className="small-regular text-light-3 text-center line-clamp-1">@{user.username}</p>
        </div>

        <Button type="button" size="sm" className="shad-button_primary px-5">
            Follow
        </Button>      
    </Link>
  )
}

export default UserCard
