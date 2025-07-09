import { Edit3, Trash2, RefreshCcw } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import './Profiles.css';

// Avatar mapping
const avatarMap = {
  Char1: 'https://learnify2025.s3.us-east-1.amazonaws.com/profiles/char_1.png',
  Char2: 'https://learnify2025.s3.us-east-1.amazonaws.com/profiles/char_2.png',
  Char3: 'https://learnify2025.s3.us-east-1.amazonaws.com/profiles/char_3.png',
  // Add more if needed
};

const ChildCard = ({
  child,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSwitch,
  language,
  onLanguageChange,
}) => {
  return (
    <div className="child-card" onClick={onSelect}>
      {isSelected && (
        <div className="child-tools">
          <Edit3 size={18} onClick={(e) => { e.stopPropagation(); onEdit(); }} />
          <Trash2 size={18} onClick={(e) => { e.stopPropagation(); onDelete(); }} />
          <RefreshCcw size={18} onClick={(e) => { e.stopPropagation(); onSwitch(); }} title="Switch Child" />
          <LanguageToggle
            language={language}
            onChange={onLanguageChange}
          />
        </div>
      )}

      <div className="child-avatar">
        <img
          src={avatarMap[child.avatar] || avatarMap.Char1}
          alt={child.childName}
          className="child-avatar-img"
        />
      </div>
      <span className="child-name">{child.childName}</span>
    </div>
  );
};

export default ChildCard;
