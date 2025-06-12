import { useState } from 'react';
import Profiles from '../components/Profiles';
import Adventures from '../components/Adventures';
import { Menu } from 'lucide-react';
import useSelectedChild from '../hooks/useSelectedChild';
import './Dashboard.css';

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [resetSelectionFn, setResetSelectionFn] = useState(() => () => {});

  const {
    selectedChildId,
    selectedChildData,
    setSelectedChildId,
    setSelectedChildData,
    resetSelection,
  } = useSelectedChild();

  const handlePlayersClick = () => {
    resetSelectionFn(); // From Profiles
    resetSelection();   // From hook
    setShowMenu(false);
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

      <Profiles
        resetSelection={setResetSelectionFn}
        setSelectedChildId={setSelectedChildId}
        selectedChildId={selectedChildId}
        setSelectedChildData={setSelectedChildData}
      />

      {selectedChildId && selectedChildData && (
        <>
          <p className="adventure-message">
            Hello <strong>{selectedChildData.childName}</strong>, select your next adventure
          </p>
          <Adventures childId={selectedChildId} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
