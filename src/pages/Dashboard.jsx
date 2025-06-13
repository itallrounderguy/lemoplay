import { useState } from 'react';
import Profiles from '../components/Profiles';
import Adventures from '../components/Adventures';
import useSelectedChild from '../hooks/useSelectedChild';
import './Dashboard.css';
import '../components/bubble.css'; // ✅ correct path



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
        
            {/* ✅ Animated dialog bubble */}
            <div className="lemo-bubble"> select your next adventure </div>
            
          
          <Adventures childId={selectedChildId} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
