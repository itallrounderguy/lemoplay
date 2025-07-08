import { useEffect, useRef, useState } from 'react';
import './ChildForm.css';
import Flag from 'react-world-flags';
import { useTranslation } from 'react-i18next';

const avatars = [
  'Lion', 'Tiger', 'Cat', 'Dog', 'Fox',
  'Frog', 'Duck', 'Hippo', 'Bear', 'Giraffe',
  'Monkey', 'Elephant', 'Owl', 'Crab', 'Robot'
];

const ChildForm = ({ userId, onClose, onSuccess, existingChild }) => {
  const { t } = useTranslation();

  const isEditing = !!existingChild;
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState(existingChild?.childName || '');
  const [childAge, setChildAge] = useState(existingChild?.childAge?.toString() || '');
  const [avatar, setAvatar] = useState(existingChild?.avatar || 'Lion');
  const [language, setLanguage] = useState(existingChild?.language || 'en');
  const [loading, setLoading] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  const iframeRef = useRef(null);
  const hasPlayedIntro = useRef(false);

  useEffect(() => {
    const handleSpineReady = (event) => {
      if (event.data?.type === 'spine-ready') {
        setIframeReady(true);
      }
    };
    window.addEventListener('message', handleSpineReady);
    return () => window.removeEventListener('message', handleSpineReady);
  }, []);

  const playAnimation = (animation) => {
    if (!iframeReady || !iframeRef.current) return;
    iframeRef.current.contentWindow.postMessage(
      { action: 'changeAnimation', animation },
      '*'
    );
  };

  useEffect(() => {
    if (!iframeReady) return;

    if (step < 5) {
      if (step === 1 && hasPlayedIntro.current) return;

      playAnimation('talk');
      const timeout = setTimeout(() => playAnimation('idle'), 2000);
      hasPlayedIntro.current = true;
      return () => clearTimeout(timeout);
    }
  }, [step, iframeReady]);

  useEffect(() => {
    if (iframeReady && step === 5) {
      playAnimation('thumbup');
    }
  }, [step, iframeReady]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `https://qnzvrnxssb.execute-api.us-east-1.amazonaws.com/prod/children/${userId}/child/${existingChild.childId}`
        : `https://qnzvrnxssb.execute-api.us-east-1.amazonaws.com/prod/children/${userId}/child`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          childName,
          childAge: parseInt(childAge, 10),
          avatar,
          language,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(5);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 5000); // Show step 5 for 5 seconds
      } else {
        alert((isEditing ? t('updateFailed') : t('addFailed')) + ': ' + data.message);
      }
    } catch (err) {
      alert(t('errorOccurred'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4, 5].map(n => (
        <div key={n} className={`step-dot ${step === n ? 'active' : ''}`} />
      ))}
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content child-wizard">
        {step !== 5 && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}

        <div className="lemo-animation-wrapper">
          <iframe
            ref={iframeRef}
            src="https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/profiles/profiles.html?animation=idle&scale=1"
            width="220"
            height="200"
            className="intro1-iframe"
            title="Lemo"
            allowTransparency="true"
          />
        </div>

        {step === 1 && (
          <div className="step-transition">
            <StepIndicator />
            <h2>{t('step1Title')}</h2>
            <input
              type="text"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="wizard-input"
            />
            <button disabled={!childName} onClick={() => setStep(2)}>{t('continue')}</button>
          </div>
        )}

        {step === 2 && (
          <div className="step-transition">
            <StepIndicator />
            <h2>{t('step2Title', { childName })}</h2>
            <p className="subtext">{t('step2Subtitle')}</p>
            <input
              type="number"
              value={childAge}
              onChange={e => setChildAge(e.target.value)}
              placeholder={t('agePlaceholder')}
              className="wizard-input"
              min="1"
            />
            <div className="wizard-buttons">
              <button onClick={() => setStep(1)}>{t('back')}</button>
              <button disabled={!childAge} onClick={() => setStep(3)}>{t('continue')}</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-transition">
            <StepIndicator />
            <h2>{t('step3Title', { childName })}</h2>
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
            <div className="wizard-buttons">
              <button onClick={() => setStep(2)}>{t('back')}</button>
              <button onClick={() => setStep(4)}>{t('continue')}</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-transition">
            <StepIndicator />
            <h2>{t('step4Title', { childName })}</h2>
            <div className="flag-select-grid">
              <div
                className={`flag-option ${language === 'en' ? 'selected' : ''}`}
                onClick={() => setLanguage('en')}
              >
                <Flag code="us" style={{ width: 60, height: 40 }} />
                <p>English</p>
              </div>
              <div
                className={`flag-option ${language === 'ar' ? 'selected' : ''}`}
                onClick={() => setLanguage('ar')}
              >
                <Flag code="sa" style={{ width: 60, height: 40 }} />
                <p>العربية</p>
              </div>
            </div>
            <div className="wizard-buttons">
              <button onClick={() => setStep(3)}>{t('back')}</button>
              <button onClick={handleSubmit} disabled={loading}>
                {loading
                  ? (isEditing ? t('updating') : t('adding'))
                  : (isEditing ? t('updateChild') : t('addChild'))}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="step-transition">
            <StepIndicator />
            <h2>🎉 {t('congratulations')}</h2>
            <p>{t('step5Message', { childName })}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildForm;
