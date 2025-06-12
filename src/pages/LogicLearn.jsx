import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useSelectedChild from '../hooks/useSelectedChild';

const LogicLearn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedChildId } = useSelectedChild();

  const childId = location.state?.childId || selectedChildId;

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
        Back
      </button>
      <h1>LogicLearn Adventure for Child ID: {childId}</h1>
    </div>
  );
};

export default LogicLearn;
