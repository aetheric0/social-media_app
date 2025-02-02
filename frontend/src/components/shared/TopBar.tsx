import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutAccount } from '../../hooks/queriesAndMutations';
import { useEffect } from 'react';
import { useUserContext } from '../../context/AuthProvider';

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate])
  return (
    <div>
      <section className="topbar">
        <div className="flex-between py-2 px-5">
          <Link to="/" className="flex gap-3 items-center">
            <img 
              src="/assets/images/logo5.png" 
              alt="logo" 
              width={60} 
              height={325} 
            />
          </Link>

          <div className="flex gap-4">
            <Button variant="ghost" className="shad-button_ghost" onClick={ () => signOut() }>
              <img src="/assets/icons/logout.svg" alt="logout" />
            </Button>
            <Link to={`/profile/${user._id}`} className="flex-center gap-3">
              <img 
                src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                alt="profile"
                className="h-8 w-8 rounded-full"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TopBar;
