import { useLocation } from 'react-router-dom';

const MemoryGames = () => {
  const location = useLocation();
  const childId = location.state?.childId;

  return (
    <div>
      <h2>Memory Games for Child ID: {childId}</h2>
    </div>
  );
};

export default MemoryGames;