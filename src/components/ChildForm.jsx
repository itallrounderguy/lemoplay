//childform.jsx
 
import { useState } from 'react';
import './ChildForm.css';

const avatars = [
  'Lion', 'Tiger', 'Cat', 'Dog', 'Fox',
  'Frog', 'Duck', 'Hippo', 'Bear', 'Giraffe',
  'Monkey', 'Elephant', 'Owl', 'Crab', 'Robot'
];

const ChildForm = ({ userId, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [avatar, setAvatar] = useState('Lion');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://qnzvrnxssb.execute-api.us-east-1.amazonaws.com/prod/children/${userId}/child`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({
          childName,
          childAge: parseInt(childAge, 10),
          avatar
        })
      });

      const data = await res.json();

      if (res.ok) {
  onSuccess(); // ✅ No data passed
  onClose();
} else {
        alert('Failed to add child: ' + data.message);
      }
    } catch (err) {
      alert('Something went wrong. Check console.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="step-indicator">
      <div className={`step-dot ${step === 1 ? 'active' : ''}`} />
      <div className={`step-dot ${step === 2 ? 'active' : ''}`} />
      <div className={`step-dot ${step === 3 ? 'active' : ''}`} />
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content child-wizard">
        <button className="close-btn" onClick={onClose}>×</button>

        {step === 1 && (
          <div className="step-transition">
            <StepIndicator />
            <h2>What is your child’s name?</h2>
            <p className="subtext">They’ll learn how to write it themselves</p>
            <input
              type="text"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              placeholder="Name"
              className="wizard-input"
            />
            <button disabled={!childName} onClick={() => setStep(2)}>Continue</button>
          </div>
        )}

        {step === 2 && (
          <div className="step-transition">
            <StepIndicator />
            <h2>How old is {childName}?</h2>
            <p className="subtext">We’ll personalize the experience</p>
            <input
              type="number"
              value={childAge}
              onChange={e => setChildAge(e.target.value)}
              placeholder="Age"
              className="wizard-input"
              min="1"
            />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => setStep(1)}>Back</button>
              <button disabled={!childAge} onClick={() => setStep(3)}>Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-transition">
            <StepIndicator />
            <h2>Choose a Character for {childName}</h2>
            <div className="avatar-grid">
              {avatars.map(name => (
                <div
                  key={name}
                  className={`avatar-option ${avatar === name ? 'selected' : ''}`}
                  onClick={() => setAvatar(name)}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`}
                    alt={name}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => setStep(2)}>Back</button>
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Adding...' : 'Add Child'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildForm;
