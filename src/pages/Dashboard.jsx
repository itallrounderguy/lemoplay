import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import ChildForm from '../components/ChildForm';

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
    <div style={{ padding: '1rem' }}>
      <p>Hello, <strong>{user.name}</strong>!</p>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ textAlign: 'center' }}>Who's Leraning?</h3>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '20px',
        }}>
          {children.map(child => (
            <div
              key={child.childId}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '90px',
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#f6f6f6',
                border: '2px solid #00bcd4',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${child.avatar || 'avatar'}`}
                  alt="avatar"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <span style={{ marginTop: '5px', fontWeight: '600' }}>{child.childName}</span>
            </div>
          ))}

          {/* Add Child Button */}
          <div
            onClick={() => setShowChildForm(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              width: '90px',
              opacity: 0.6,
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '2px dashed #bbb',
              backgroundColor: '#f1f1f1',
              fontSize: '2rem',
              color: '#777',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>+</div>
            <span style={{ marginTop: '5px' }}>Add a child</span>
          </div>
        </div>
      </div>

      {/* Modal for adding child */}
      {showChildForm && (
        <ChildForm
          onClose={() => setShowChildForm(false)}
          onSuccess={handleSubmitChild}
        />
      )}
    </div>
  );
};

export default Dashboard;
