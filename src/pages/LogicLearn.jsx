import { useLocation } from 'react-router-dom';

const LogicLearn = () => {
  const location = useLocation();
  const childId = location.state?.childId;

  return (
    <div>
      <h2>Logic Adventure for Child ID: {childId}</h2>
    </div>
  );
};

export default LogicLearn;