// Dashboard.jsx
import { useState } from 'react';
import Profiles from './Profiles';
import { Menu } from 'lucide-react';
import './Dashboard.css'; // Ensure your styles are loaded

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [resetSelectionFn, setResetSelectionFn] = useState(() => () => {});

  const handlePlayersClick = () => {
    resetSelectionFn(); // Clear selected child
    setShowMenu(false); // Close the menu
  };

  return (
      <div className="dashboard">
        <button
          className="menu-button"
          onClick={() => setShowMenu(prev => !prev)}
        >
          <Menu size={20} />
        </button>

        {showMenu && (
          <div className="mobile-menu">
            <div className="menu-item" onClick={handlePlayersClick}>
              Players
            </div>
          </div>
        )}

        <Profiles resetSelection={setResetSelectionFn} />
      </div>
  );
};

export default Dashboard;
