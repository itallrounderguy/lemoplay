import { useState } from 'react';
import Profiles from '../components/Profiles';
import Adventures from '../components/Adventures';
import useSelectedChild from '../hooks/useSelectedChild';
import './Dashboard.css';

const Dashboard = () => {
  const [resetSelectionFn, setResetSelectionFn] = useState(() => () => {});

  const {
    selectedChildId,
    selectedChildData,
    setSelectedChildId,
    setSelectedChildData,
    resetSelection,
  } = useSelectedChild();

  return (
    <div className="dashboard">
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
