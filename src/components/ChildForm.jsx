import { useEffect, useRef, useState } from 'react';
import Flag from 'react-world-flags';
import { useTranslation } from 'react-i18next';
import avatars from './avatars';
import i18n from 'i18next';
import './ChildForm.css';

const ChildForm = ({ userId, onClose, onSuccess, existingChild }) => {
  const { t } = useTranslation();
  const isEditing = !!existingChild;

  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState(existingChild?.childName || '');
  const [childAge, setChildAge] = useState(existingChild?.childAge?.toString() || '');
  const [avatar, setAvatar] = useState(existingChild?.avatar || avatars[0].label);
  const detectedLang = i18n.language?.split('-')[0] || 'en';
  const [language, setLanguage] = useState(existingChild?.language || detectedLang);
  const [languageLearnLevel] = useState(existingChild?.LanguageLearnLevel || 1);
  const [loading, setLoading] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  const iframeRef = useRef(null);
  const hasPlayedIntro = useRef(false);
  const audioRef = useRef(new Audio());

  const playAnimation = (animation) => {
    if (!iframeReady || !iframeRef.current) return;
    iframeRef.current.contentWindow.postMessage(
      { action: 'changeAnimation', animation },
      '*'
    );
  };

  useEffect(() => {
    const handleSpineReady = (event) => {
      if (event.data?.type === 'spine-ready') {
        console.log('[ChildForm] 🧬 Spine ready');
        setIframeReady(true);
      }
    };
    window.addEventListener('message', handleSpineReady);
    return () => window.removeEventListener('message', handleSpineReady);
  }, []);

  useEffect(() => {
    console.log('[ChildForm] 🧭 Step changed to:', step);

    const audio = audioRef.current;
    if (!iframeReady || (step === 1 && hasPlayedIntro.current)) return;

    const langForThisStep = language;
    const url = `https://learnify2025.s3.us-east-1.amazonaws.com/profiles/profiles_step${step}_${langForThisStep}.mp3`;
    audio.src = url;

    const handlePlay = () => playAnimation('talk');
    const handleEnded = () => {
      if (step !== 5) playAnimation('idle');
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('ended', handleEnded);
    audio.play().catch(console.error);

    if (step === 1) hasPlayedIntro.current = true;

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [step, iframeReady]);

  useEffect(() => {
    if (iframeReady && step === 5) {
      playAnimation('thumbup');
    }
  }, [step, iframeReady]);

  const handleSubmit = async () => {
    setLoading(true);
    console.log('[ChildForm] 📤 Submitting form...');
    console.log(' - Name:', childName);
    console.log(' - Age:', childAge);
    console.log(' - Avatar:', avatar);
    console.log(' - Language:', language);
    console.log(' - LanguageLearnLevel:', languageLearnLevel);

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
          LanguageLearnLevel: languageLearnLevel,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('[ChildForm] ✅ Save success');
        setStep(5);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 5000);
      } else {
        console.error('[ChildForm] ❌ Save failed:', data.message);
        alert((isEditing ? t('updateFailed') : t('addFailed')) + ': ' + data.message);
      }
    } catch (err) {
      console.error('[ChildForm] ❗ Error occurred:', err);
      alert(t('errorOccurred'));
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
            <p className="subtext">{t('step1Subtitle')}</p>
            <input
              type="text"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="wizard-input"
            />
            <button disabled={!childName} onClick={() => setStep(2)}>
              {t('continue')}
            </button>
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
              <button disabled={!childAge} onClick={() => setStep(3)}>
                {t('continue')}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-transition">
            <StepIndicator />
            <h2>{t('step3Title', { childName })}</h2>
            <p className="subtext">{t('step3Subtitle')}</p>
            <div className="avatar-grid">
              {avatars.map(({ label, src }) => (
                <div
                  key={label}
                  className={`avatar-option ${avatar === label ? 'selected' : ''}`}
                  onClick={() => {
                    console.log('[ChildForm] 🎨 Avatar selected:', label);
                    setAvatar(label);
                  }}
                >
                  <img src={src} alt={label} />
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
            <p className="subtext">{t('step4Subtitle')}</p>
            <div className="flag-select-grid">
              <div
                className={`flag-option ${language === 'en' ? 'selected' : ''}`}
                onClick={() => {
                  console.log('[ChildForm] 🇺🇸 Language selected: en');
                  setLanguage('en');
                }}
              >
                <Flag code="us" style={{ width: 60, height: 40 }} />
                <p>English</p>
              </div>
              <div
                className={`flag-option ${language === 'ar' ? 'selected' : ''}`}
                onClick={() => {
                  console.log('[ChildForm] 🇸🇦 Language selected: ar');
                  setLanguage('ar');
                }}
              >
                <Flag code="sa" style={{ width: 60, height: 40 }} />
                <p>العربية</p>
              </div>
            </div>
            <div className="wizard-buttons">
              <button onClick={() => setStep(3)}>{t('back')}</button>
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? (isEditing ? t('updating') : t('adding')) : (isEditing ? t('updateChild') : t('addChild'))}
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
