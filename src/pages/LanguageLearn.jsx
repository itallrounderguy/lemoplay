import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Optional icon lib

const LanguageLearn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const childId = location.state?.childId || localStorage.getItem('selectedChildId');


  const handleBack = () => {
    navigate(-1); // go back to the previous page
  };

  return (
    <div>
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
        Back
      </button>

      <h2>Language Adventure for Child ID: {childId}</h2>
      {/* Your language game/activities go here */}
    </div>
  );
};

export default LanguageLearn;
