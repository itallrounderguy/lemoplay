// pages/Dashboard.jsx
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

const PLAYER_API = 'https://1bt9pt3of2.execute-api.us-east-1.amazonaws.com/items';
const CHILDREN_API = 'https://qnzvrnxssb.execute-api.us-east-1.amazonaws.com/prod/children';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [playerData, setPlayerData] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        // ✅ Fetch children (with x-user-id header)
        const childRes = await fetch(`${CHILDREN_API}/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId // 👈 Custom auth header
          }
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

  if (loading) return <p>Loading your dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>⚠️ {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Welcome to your Dashboard</h2>
      <p>Hello, <strong>{user.name}</strong>!</p>

      {playerData && (
        <div style={{
          marginTop: '20px',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          maxWidth: '400px',
          margin: '20px auto',
          textAlign: 'left'
        }}>
          <p><strong>Player Name:</strong> {playerData.playername}</p>
          <p><strong>Email:</strong> {playerData.email}</p>
          <p><strong>Language:</strong> {playerData.language}</p>
          <p><strong>Verified:</strong> {playerData.verified}</p>
        </div>
      )}

      <h3 style={{ marginTop: '40px', textAlign: 'center' }}>Your Children</h3>
      {children.length === 0 ? (
        <p style={{ textAlign: 'center' }}>You haven't added any child profiles yet.</p>
      ) : (
        <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
          {children.map(child => (
            <li key={child.childId}>
              <strong>{child.childName}</strong> (Age: {child.childAge}, Avatar: {child.avatar})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
