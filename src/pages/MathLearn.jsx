import { useLocation } from 'react-router-dom';

const MathLearn = () => {
  const location = useLocation();
  const childId = location.state?.childId;

  return (
    <div>
      <h2>Math Adventure for Child ID: {childId}</h2>
    </div>
  );
};

export default MathLearn;