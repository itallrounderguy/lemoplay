import { Edit3, Trash2, Users } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import './ChildCard.css';
import { avatarMap } from './avatars';


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
          <Users  size={18} onClick={(e) => { e.stopPropagation(); onSwitch(); }} title="Switch Child" />
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
