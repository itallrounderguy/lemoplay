import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { UserContext } from '../App'; // ✅ Access user context
import './GlobalMenu.css';

const GlobalMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // ✅ Get setUser from context

  const handleMenuClick = () => setShowMenu(prev => !prev);

  const handlePlayersClick = () => {
    navigate('/dashboard');
    setShowMenu(false);
  };

  const handleLogout = () => {
    setUser(null); // ✅ clear user from context
    localStorage.removeItem('user'); // ✅ clear from storage
    navigate('/login'); // ✅ redirect to login
    setShowMenu(false);
  };

  return (
    <>
      <button className="menu-button" onClick={handleMenuClick}>
        <Menu size={20} />
      </button>

      {showMenu && (
        <div className="mobile-menu">
          <div className="menu-item" onClick={handlePlayersClick}>
            Home
          </div>
          <div className="menu-item" onClick={handleLogout}>
            Log Out
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalMenu;
