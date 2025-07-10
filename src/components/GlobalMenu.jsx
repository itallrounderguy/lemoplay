import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import LogoutModal from './LogoutModal'; // ✅ import the modal
import './GlobalMenu.css';
import { Menu, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // ✅ add this


const GlobalMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ control modal
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { t } = useTranslation(); // ✅ hook for translations

  const handleMenuClick = () => setShowMenu(prev => !prev);

  const handlePlayersClick = () => {
    navigate('/dashboard');
    setShowMenu(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true); // ✅ show modal
    setShowMenu(false);
  };

  const handleConfirmLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <button className="menu-button" onClick={handleMenuClick}>
        <Menu size={20} />
      </button>

      {showMenu && (
      <div className="mobile-menu">
        <div className="menu-item" onClick={handlePlayersClick}>
          {t('home')}
        </div>
        <div className="menu-item" onClick={handleLogoutClick}>
          {t('logout')}
        </div>
      </div>
    )}


      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </>
  );
};

export default GlobalMenu;