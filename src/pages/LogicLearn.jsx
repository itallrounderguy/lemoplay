import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';   

const LogicLearn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [childId, setChildId] = useState(null);

  useEffect(() => {
    const stateChildId = location.state?.childId;
    if (stateChildId) {
      setChildId(stateChildId);
    } else {
      const stored = localStorage.getItem('selectedChildId');
      if (stored) setChildId(stored);
    }
  }, [location]);

  const handleBack = () => {
    navigate('/dashboard'); // No reset
  };

  return (
    <div>
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
        Back</button>
      <h1>LogicLearn Adventure for Child ID: {childId}</h1>
    </div>
  );
};

export default LogicLearn;
