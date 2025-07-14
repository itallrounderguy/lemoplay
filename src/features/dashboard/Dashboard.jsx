/*Dashboard.jsx*/

import { useState } from 'react';
import Profiles from "@features/profile/Profiles";

import Adventures from './Adventures';
import useSelectedChild from '../../hooks/useSelectedChild';

import "@styles/Dashboard.css";
import "@styles/bubble.css";

import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const [resetSelectionFn, setResetSelectionFn] = useState(() => () => {});
  const { t } = useTranslation();

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
            <div className="lemo-bubble">{t('selectAdventure')}</div>
            
          
          <Adventures childId={selectedChildId} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
