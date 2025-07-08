// Profile.jsx (refactored)
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import ChildForm from './ChildForm';
import ChildCard from './ChildCard';
import './Profiles.css';

const CHILDREN_API = 'https://qnzvrnxssb.execute-api.us-east-1.amazonaws.com/prod/children';

const Profile = ({ resetSelection, setSelectedChildId, selectedChildId, setSelectedChildData }) => {
  const { user } = useContext(UserContext);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChildForm, setShowChildForm] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'no');

  useEffect(() => {
    if (!user) return;

const fetchChildren = async () => {
  try {
    const res = await fetch(`${CHILDREN_API}/${user.sub}`, {
      headers: { 'Content-Type': 'application/json', 'x-user-id': user.sub },
    });

    if (res.ok) {
      const data = await res.json();
      setChildren(data);

      // ✅ Automatically open wizard if user has no children
      if (data.length === 0 && !selectedChildId) {
        setShowChildForm(true);
      }
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
    if (resetSelection) {
      resetSelection(() => {
        setSelectedChildId(null);
        setSelectedChildData(null);
      });
    }
  }, []);

  const refreshChildren = async () => {
    const res = await fetch(`${CHILDREN_API}/${user.sub}`, {
      headers: { 'Content-Type': 'application/json', 'x-user-id': user.sub },
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
    if (!window.confirm('Are you sure you want to delete this child?')) return;
    try {
      await fetch(`${CHILDREN_API}/${user.sub}/child/${childId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.sub },
      });
      await refreshChildren();
      setSelectedChildId(null);
      setSelectedChildData(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);

    if (selectedChildId) {
      const selectedChild = children.find(c => c.childId === selectedChildId);
      if (selectedChild) {
        try {
          await fetch(`${CHILDREN_API}/${user.sub}/child/${selectedChildId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-user-id': user.sub },
            body: JSON.stringify({ ...selectedChild, language: lang }),
          });
          await refreshChildren();
        } catch (err) {
          console.error('Failed to update child language:', err);
        }
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const filteredChildren = selectedChildId ? children.filter(c => c.childId === selectedChildId) : children;

  return (
    <div className="child-section">
      {!selectedChildId && (
        <div className="lemo-intro">
         
          <div className="lemo-bubble">
            Hi! Add a child to begin, or select one you've already created.
          </div>
        </div>
      )}

      <div className={`child-grid ${selectedChildId ? 'single-view' : ''}`}>
        {filteredChildren.map(child => (
          <ChildCard
            key={child.childId}
            child={child}
            isSelected={selectedChildId === child.childId}
            onSelect={() => {
              if (!selectedChildId) {
                setSelectedChildId(child.childId);
                setSelectedChildData(child);
                const lang = child.language || 'off';
                setLanguage(lang);
                localStorage.setItem('language', lang);
              }
            }}
            onEdit={() => {
              setEditingChild(child);
              setShowChildForm(true);
            }}
            onDelete={() => handleDeleteChild(child.childId)}
            onSwitch={() => {
              setSelectedChildId(null);
              setSelectedChildData(null);
            }}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
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
