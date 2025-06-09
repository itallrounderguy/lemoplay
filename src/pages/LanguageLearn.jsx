import { useLocation } from 'react-router-dom';

const LanguageLearn = () => {
  const location = useLocation();
  const childId = location.state?.childId;

  return (
    <div>
      <h2>Language Adventure for Child ID: {childId}</h2>
    </div>
  );
};

export default LanguageLearn;
