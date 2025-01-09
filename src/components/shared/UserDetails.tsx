import { Link } from 'react-router-dom';
import { useGetUsers } from '@/hooks/queriesAndMutations';
import { IUser } from '@/lib/types';
import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';


const UserDetails = () => {
    const { data : usersData, isPending: isLoadingUsers } = useGetUsers();
    const users = usersData?.data?.users
  
    return (
      <>
        { isLoadingUsers && !users ? 
        (
          <Loader />
        ): (
          <ul className="user-grid">
            {users.map((user: IUser) => {
              return (
                <div className="user-card text-center">
                  <li key={user._id}>
                    <Link to={`/profile/${user._id}`} >
                      <img 
                        src={user.imageUrl} 
                        alt="profile"
                        className="h-16 w-16 rounded-full mb-3"
                      />
                      <p className="base-semibold w-full">
                        {user.firstName}
                      </p>
                      <p className="small-regular text-light-3">
                        @{user.username}
                      </p>
                      <Button 
                        type="submit" 
                        className="shad-button_primary mt-4"
                      >
                        Follow
                      </Button>
                    </Link>
                  </li>
                </div>
              )})
            }
          </ul>
        )}
      </>
    )
  }

export default UserDetails;
