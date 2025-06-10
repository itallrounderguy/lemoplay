import { useEffect, useState } from 'react';
import Profiles from '../components/Profiles';
import Adventures from '../components/Adventures';
import { Menu } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [resetSelectionFn, setResetSelectionFn] = useState(() => () => {});
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedChildData, setSelectedChildData] = useState(null);

  useEffect(() => {
    // Load child from localStorage if available
    const storedId = localStorage.getItem('selectedChildId');
    const storedData = localStorage.getItem('selectedChildData');
    if (storedId && storedData) {
      setSelectedChildId(storedId);
      setSelectedChildData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (selectedChildId && selectedChildData) {
      localStorage.setItem('selectedChildId', selectedChildId);
      localStorage.setItem('selectedChildData', JSON.stringify(selectedChildData));
    }
  }, [selectedChildId, selectedChildData]);

  const handlePlayersClick = () => {
    resetSelectionFn();
    setSelectedChildId(null);
    setSelectedChildData(null);
    localStorage.removeItem('selectedChildId');
    localStorage.removeItem('selectedChildData');
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
