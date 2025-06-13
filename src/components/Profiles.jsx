import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import ChildForm from './ChildForm';
import { Edit3, Trash2, RefreshCcw } from 'lucide-react';
import './Profiles.css';

const CHILDREN_API = 'https://qnzvrnxssb.execute-api.us-east-1.amazonaws.com/prod/children';

const Profile = ({
  resetSelection,
  setSelectedChildId,
  selectedChildId,
  setSelectedChildData,
}) => {
  const { user } = useContext(UserContext);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChildForm, setShowChildForm] = useState(false);
  const [editingChild, setEditingChild] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchChildren = async () => {
      try {
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
      } catch (err) {
        console.error('Error fetching children:', err);
        setError('Failed to fetch children');
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [user]);

  useEffect(() => {
    if (typeof resetSelection === 'function') {
      resetSelection(() => () => {
        setSelectedChildId(null);
        setSelectedChildData(null);
      });
    }
  }, [resetSelection, setSelectedChildId, setSelectedChildData]);

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

      if (selectedChildId) {
        const updatedChild = data.find(c => c.childId === selectedChildId);
        setSelectedChildData(updatedChild || null);
      }
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
      setSelectedChildData(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const filteredChildren = selectedChildId
    ? children.filter(c => c.childId === selectedChildId)
    : children;

  return (
    <div className="child-section">
      {!selectedChildId && (
  <div className="lemo-intro">
   
    <iframe
      src="https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/intro1/intro1.html"
      width="220"
      height="140"
      className="intro1-iframe"
      title="intro1"
      allowTransparency="true"
    ></iframe>

    {/* ✅ Animated dialog bubble */}
    <div className="lemo-bubble">
      Hi! Add a child to begin, or select one you've already created.
    </div>
  </div>
)}

      <div className={`child-grid ${selectedChildId ? 'single-view' : ''}`}>
        {filteredChildren.map(child => (
          <div
            key={child.childId}
            className="child-card"
            onClick={() => {
              if (!selectedChildId) {
                setSelectedChildId(child.childId);
                setSelectedChildData(child);
              }
            }}
          >
            {selectedChildId === child.childId && (
              <div className="child-tools">
                <Edit3
                  size={18}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingChild(child);
                    setShowChildForm(true);
                  }}
                />
                <Trash2
                  size={18}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChild(child.childId);
                  }}
                />
                <RefreshCcw
                  size={18}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedChildId(null);
                    setSelectedChildData(null);
                  }}
                  title="Switch Child"
                />
              </div>
            )}

            <div className="child-avatar">
              <img
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${child.avatar || 'avatar'}`}
                alt="avatar"
              />
            </div>
            <span className="child-name">{child.childName}</span>
          </div>
        ))}

        {!selectedChildId && children.length < 5 && (
          <div className="child-add-card" onClick={() => setShowChildForm(true)}>
            <div className="add-avatar">+</div>
            <span className="add-label">Add a child</span>
          </div>
        )}
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

export default Profile;
