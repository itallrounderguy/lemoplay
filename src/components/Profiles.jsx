import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import ChildForm from './ChildForm';
import ChildCard from './ChildCard';
import './Profiles.css';
import { useTranslation } from 'react-i18next';

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
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'no');
  const { t } = useTranslation(); // ✅ move hook here

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

          // Automatically open wizard if no children exist
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

  const filteredChildren = selectedChildId
    ? children.filter(c => c.childId === selectedChildId)
    : children;

  return (
    <div className="child-section">
      {!selectedChildId && (
        <div className="lemo-intro">
          <div className="lemo-bubble">
          {t('introMessage')}
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
                          console.log('[Profile] 👤 Child selected:', child.childName);
                          console.log('[Profile] 📦 Full child object:', child);

                          const lang = child.language || 'off';
                          const level = child.LanguageLearnLevel || 1;
                          const avatar = child.avatar || 'Char1';

                          console.log('[Profile] 💾 Writing to localStorage:');
                          console.log(' - language:', lang);
                          console.log(' - languageLearnLevel:', level);
                          console.log(' - avatar:', avatar);

                          // 🔁 Set React state
                          setSelectedChildId(child.childId);
                          setSelectedChildData(child);
                          setLanguage(lang);

                          // 💾 Set persistent storage
                          localStorage.setItem('language', lang);
                          localStorage.setItem('languageLearnLevel', level.toString());
                          localStorage.setItem('avatar', avatar);
                        } else {
                          console.log('[Profile] ⚠️ onSelect called, but a child is already selected. Skipping.');
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
      </div>

      {/* ✅ Add a child button shown under the grid */}
      {!selectedChildId && children.length < 5 && (
        <div className="add-child-wrapper">
          <div className="child-add-card" onClick={() => setShowChildForm(true)}>
            <div className="add-avatar">+</div>
            <span className="add-label">{t('addChildLabel')}</span>
          </div>
        </div>
      )}

      {showChildForm && (
        <ChildForm
          userId={user.sub}
          onClose={() => {
            setShowChildForm(false);
            setEditingChild(null);
          }}
          onSuccess={async () => {
  const res = await fetch(`${CHILDREN_API}/${user.sub}`, {
    headers: { 'Content-Type': 'application/json', 'x-user-id': user.sub },
  });

  if (res.ok) {
    const updatedChildren = await res.json();
    setChildren(updatedChildren);
    setShowChildForm(false);
    setEditingChild(null);

    if (selectedChildId) {
      const updatedChild = updatedChildren.find(c => c.childId === selectedChildId);
      if (updatedChild) {
        console.log('[Profile] 🛠 Updating localStorage with fresh child data');
        localStorage.setItem('language', updatedChild.language || 'off');
        localStorage.setItem('languageLearnLevel', (updatedChild.LanguageLearnLevel || 1).toString());
        localStorage.setItem('avatar', updatedChild.avatar || 'Char1');
      }
    }
  } else {
    console.error('[Profile] ❌ Failed to refresh children after save');
  }
}}

          existingChild={editingChild}
        />
      )}
    </div>
  );
};

export default Profile;
