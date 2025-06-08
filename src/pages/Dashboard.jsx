import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import ChildForm from '../components/ChildForm';
import './Dashboard.css'; // Make sure this file exists and is imported

const PLAYER_API = 'https://1bt9pt3of2.execute-api.us-east-1.amazonaws.com/items';
const CHILDREN_API = 'https://qnzvrnxssb.execute-api.us-east-1.amazonaws.com/prod/children';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [playerData, setPlayerData] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChildForm, setShowChildForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userId = user.sub;

    const fetchOrCreatePlayer = async () => {
      try {
        const res = await fetch(`${PLAYER_API}/${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setPlayerData(data);
          } else {
            setError('Player record is empty.');
            return;
          }
        } else if (res.status === 404) {
          const newPlayer = {
            id: userId,
            playername: user.name || 'New Player',
            accessto: 'default',
            verified: 'no',
            age: 0,
            email: user.email,
            language: 'en',
          };
          const createRes = await fetch(PLAYER_API, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlayer),
          });
          const createData = await createRes.json();
          if (createRes.ok) {
            setPlayerData(newPlayer);
          } else {
            setError(`Failed to create player: ${createData.message || createData}`);
            return;
          }
        } else {
          setError(`Unexpected error: ${res.status}`);
          return;
        }

        const childRes = await fetch(`${CHILDREN_API}/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        });

        if (childRes.ok) {
          const childrenList = await childRes.json();
          setChildren(childrenList);
        } else {
          console.warn('No children found or failed to fetch children.');
        }

      } catch (err) {
        console.error('Error accessing API:', err);
        setError('Failed to communicate with server.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreatePlayer();
  }, [user]);

  const handleSubmitChild = async (child) => {
    if (children.length >= 5) {
      alert('You can only add up to 5 children.');
      return;
    }

    try {
      const res = await fetch(`${CHILDREN_API}/${user.sub}/child`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.sub,
        },
        body: JSON.stringify(child),
      });

      if (res.ok) {
        const data = await res.json();
        setChildren(prev => [...prev, { ...child, childId: data.childId }]);
        setShowChildForm(false);
      } else {
        console.error('Failed to create child:', await res.text());
      }
    } catch (err) {
      console.error('Error submitting child:', err);
    }
  };

  if (loading) return <p>Loading your dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>⚠️ {error}</p>;

  return (
    <div className="dashboard">
      <p>Hello, <strong>{user.name}</strong>!</p>

      <div className="child-section">
        <h3>Who's Learning?</h3>
        <div className="child-grid">
          {children.map(child => (
            <div className="child-card" key={child.childId}>
              <div className="child-avatar">
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${child.avatar || 'avatar'}`}
                  alt="avatar"
                />
              </div>
              <span className="child-name">{child.childName}</span>
            </div>
          ))}

          {children.length < 5 ? (
            <div className="child-add-card" onClick={() => setShowChildForm(true)}>
              <div className="add-avatar">+</div>
              <span className="add-label">Add a child</span>
            </div>
          ) : (
            <p className="child-limit-warning">Maximum of 5 children reached.</p>
          )}
        </div>
      </div>

      {showChildForm && (
        <ChildForm
          userId={user.sub}
          onClose={() => setShowChildForm(false)}
          onSuccess={handleSubmitChild}
        />
      )}
    </div>
  );
};

export default Dashboard;
