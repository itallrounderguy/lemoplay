// pages/Dashboard.jsx
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

const API_BASE = 'https://1bt9pt3of2.execute-api.us-east-1.amazonaws.com/items';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const userId = user.sub;

    const fetchOrCreatePlayer = async () => {
      try {
        const res = await fetch(`${API_BASE}/${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setPlayerData(data);
          } else {
            setError('Player record is empty.');
          }
        } else if (res.status === 404) {
          // Create new player
          const newPlayer = {
            id: userId,
            playername: user.name || 'New Player',
            accessto: 'default',
            verified: 'no',
            age: 0,
            email: user.email,
            language: 'en',
          };

          const createRes = await fetch(API_BASE, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlayer),
          });

          const createData = await createRes.json();

          if (createRes.ok) {
            setPlayerData(newPlayer);
          } else {
            setError(`Failed to create player: ${createData.message || createData}`);
          }
        } else {
          setError(`Unexpected error: ${res.status}`);
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
    </div>
  );
};

export default Dashboard;
