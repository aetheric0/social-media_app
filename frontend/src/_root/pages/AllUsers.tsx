import Loader from '@/components/shared/Loader';
import UserCard from '@/components/shared/UserCard';
import { useGetUsers } from '@/hooks/queriesAndMutations';
import { IUser } from '@/lib/types';


const AllUsers = () => {
  const { data : usersData, isPending: isLoadingUsers } = useGetUsers();
      const users = usersData?.users
    
    return (
      <div className="common-container">
        <div className="user-container p-8">
          <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
          {isLoadingUsers && !users ? (
            <Loader />
          ) : (
            <ul className="user-grid">
              {users.map((user: IUser) => (
                <li key={user._id} className="flex-1 min-w-[200px] w-full">
                  <UserCard user={user}/>
                </li>
              ))}
            </ul>
          )
        }
      </div>
      </div>
    )
  }

export default AllUsers;