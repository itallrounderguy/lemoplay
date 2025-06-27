// ChildCard.jsx
import { Edit3, Trash2, RefreshCcw } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import './Profiles.css';

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
            onChange={(lang) => { e.stopPropagation(); onLanguageChange(lang); }}
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
  );
};

export default ChildCard;
