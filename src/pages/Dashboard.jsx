import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import ChildForm from '../components/ChildForm';
import './Dashboard.css';
import { Edit3, Trash2 } from 'lucide-react';

const PLAYER_API = 'https://1bt9pt3of2.execute-api.us-east-1.amazonaws.com/items';
const CHILDREN_API = 'https://qnzvrnxssb.execute-api.us-east-1.amazonaws.com/prod/children';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [playerData, setPlayerData] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChildForm, setShowChildForm] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [editingChild, setEditingChild] = useState(null);

  useEffect(() => {
    if (!user) return;
    const userId = user.sub;

    const fetchChildren = async () => {
      try {
        const res = await fetch(`${CHILDREN_API}/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setChildren(data);
        }
      } catch (err) {
        console.error('Error fetching children:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [user]);

  const refreshChildren = async () => {
    const res = await fetch(`${CHILDREN_API}/${user.sub}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.sub,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setChildren(data);
    }
  };

  const handleDeleteChild = async (childId) => {
    const confirm = window.confirm('Are you sure you want to delete this child?');
    if (!confirm) return;
    try {
      await fetch(`${CHILDREN_API}/${user.sub}/child/${childId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.sub,
        },
      });
      await refreshChildren();
      setSelectedChildId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredChildren = selectedChildId
    ? children.filter(c => c.childId === selectedChildId)
    : children;

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="dashboard">
      <p>Hello, <strong>{user.name}</strong>!</p>

      <div className="child-section">
        <h3>Who's Learning?</h3>
        <div className={`child-grid ${selectedChildId ? 'single-view' : ''}`}>
          {filteredChildren.map(child => (
            <div
              key={child.childId}
              className="child-card"
              onClick={() => !selectedChildId && setSelectedChildId(child.childId)}
            >
              <div className="child-avatar">
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${child.avatar || 'avatar'}`}
                  alt="avatar"
                />
              </div>
              <span className="child-name">{child.childName}</span>

              {selectedChildId === child.childId && (
                <div className="dropdown-menu">
                  <div onClick={() => {
                    setEditingChild(child);
                    setShowChildForm(true);
                  }}>
                    <Edit3 size={18} />
                  </div>
                  <div onClick={() => handleDeleteChild(child.childId)}>
                    <Trash2 size={18} />
                  </div>
                </div>
              )}
            </div>
          ))}

          {!selectedChildId && children.length < 5 && (
            <div className="child-add-card" onClick={() => setShowChildForm(true)}>
              <div className="add-avatar">+</div>
              <span className="add-label">Add a child</span>
            </div>
          )}
        </div>
      </div>

      {showChildForm && (
        <ChildForm
          userId={user.sub}
          onClose={() => {
            setShowChildForm(false);
            setEditingChild(null);
          }}
          onSuccess={async () => {
            await refreshChildren();
            setShowChildForm(false);
            setEditingChild(null);
          }}
          existingChild={editingChild}
        />
      )}
    </div>
  );
};

export default Dashboard;
