// components/ChildForm.jsx
import { useState } from 'react';
import './ChildForm.css'; // optional for styles

const ChildForm = ({ onClose, onSubmit }) => {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [avatar, setAvatar] = useState('lion');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!childName || !childAge || !avatar) {
      setError('Please fill in all fields.');
      return;
    }

    onSubmit({ childName, childAge: parseInt(childAge), avatar });
    setChildName('');
    setChildAge('');
    setAvatar('lion');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Add New Child</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              required
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              min="1"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              required
            />
          </label>
          <label>
            Avatar:
            <select value={avatar} onChange={(e) => setAvatar(e.target.value)}>
              <option value="lion">Lion</option>
              <option value="cat">Cat</option>
              <option value="dog">Dog</option>
              <option value="fox">Fox</option>
            </select>
          </label>
          <button type="submit">Add Child</button>
        </form>
      </div>
    </div>
  );
};

export default ChildForm;
