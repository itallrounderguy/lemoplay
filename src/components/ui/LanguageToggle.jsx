import { useState, useEffect, useRef } from 'react';
import Flag from 'react-world-flags';
//import LanguageToggle from "@components/ui/LanguageToggle";


const LanguageToggle = ({ language, onChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleSelect = (lang) => {
    setShowMenu(false);
    onChange(lang);
  };

  // 👇 Close language menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toggleRef.current && !toggleRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  return (
    <div className="language-toggle-wrapper" ref={toggleRef}>
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
