import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useSelectedChild from '../hooks/useSelectedChild';
import ProgressMap from '../components/ProgressMap'; // ✅ Use correct path

const LanguageLearn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedChildId } = useSelectedChild();

  const childId = location.state?.childId || selectedChildId;

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleTileClick = (tileId) => {
    alert(`Clicked on ${tileId}`); // Replace with actual logic
  };

  return (
    <div>
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
        Back
      </button>

      <h1 style={{ marginLeft: '1rem' }}>Language Progress</h1>

      <ProgressMap onTileClick={handleTileClick} />
    </div>
  );
};

export default LanguageLearn;
