// GlobalMenu.jsx
import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import LogoutModal from './LogoutModal';
import './GlobalMenu.css';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GlobalMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const wrapperRef = useRef(null); // ✅ use wrapper instead of menuRef
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { t } = useTranslation();

  const handleMenuClick = (e) => {
    e.stopPropagation(); // prevent immediate close
    setShowMenu(prev => !prev);
  };

  const handlePlayersClick = () => {
    navigate('/dashboard');
    setShowMenu(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  return (
    <>
      <div ref={wrapperRef} className="menu-wrapper">
        <button className="menu-button" onClick={handleMenuClick}>
          <Menu size={20} />
        </button>

        {showMenu && (
          <div className="mobile-menu">
            <div className="menu-item" onClick={handlePlayersClick}>{t('home')}</div>
            <div className="menu-item" onClick={handleLogoutClick}>{t('logout')}</div>
          </div>
        )}
      </div>

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
