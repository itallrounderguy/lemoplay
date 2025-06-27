// LanguageToggle.jsx
import { useState } from 'react';
import Flag from 'react-world-flags';
import './LanguageToggle.css';

const LanguageToggle = ({ language, onChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleSelect = (lang) => {
    setShowMenu(false);
    onChange(lang);
  };

  return (
    <div className="language-toggle-wrapper" onClick={(e) => e.stopPropagation()}>
      {(language === 'en' || language === 'ar') ? (
        <Flag
          code={language === 'en' ? 'us' : 'sa'}
          className="language-flag"
          title={language === 'en' ? 'English' : 'Arabic'}
          onClick={toggleMenu}
        />
      ) : (
        <div
          className="language-none"
          title="No Language"
          onClick={toggleMenu}
        >
          ❌
        </div>
      )}

      {showMenu && (
        <div className="language-menu">
          <Flag
            code="us"
            className="language-flag"
            title="English"
            onClick={() => handleSelect('en')}
          />
          <Flag
            code="sa"
            className="language-flag"
            title="Arabic"
            onClick={() => handleSelect('ar')}
          />
          <div
            className="language-none mute-option"
            title="Mute"
            onClick={() => handleSelect('off')}
          >
            ❌
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
