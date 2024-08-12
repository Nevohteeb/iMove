import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  // Function to split the email address
  const getEmailCharactersBeforeAtSymbol = (email) => {
    const delimiter = '@';
    const parts = email.split(delimiter);
    return parts.length > 1 ? parts[0] : '';
  };

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className='container'>
        <Link to="/">
          <img className="logo" src="gm.png" alt="" />
        </Link>
        <nav>
          {user && (
            <div>
              <span>{getEmailCharactersBeforeAtSymbol(user.email)}</span>
              <button onClick={handleClick} className="logout-button">
                Logout
              </button>
            </div>
          )}

          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
