import { Edit3, Trash2, Users } from 'lucide-react';
import LanguageToggle from "@components/ui/LanguageToggle";
import '@styles/ChildCard.css';
import { avatarMap } from '../../components/constants/avatars';

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
  const handleSelect = () => {
    console.log('[ChildCard] ✅ onSelect triggered for:', child.childName);
    console.log('[ChildCard] 📦 Child data:', child);
    onSelect();
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    console.log('[ChildCard] ✏️ Edit clicked for:', child.childName);
    onEdit();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    console.log('[ChildCard] 🗑️ Delete clicked for:', child.childName);
    onDelete();
  };

  const handleSwitch = (e) => {
    e.stopPropagation();
    console.log('[ChildCard] 🔁 Switch clicked for:', child.childName);
    onSwitch();
  };

  const handleLanguageChange = (newLang) => {
    console.log('[ChildCard] 🌐 Language changed for:', child.childName, '→', newLang);
    onLanguageChange(newLang);
  };

  const avatarSrc = avatarMap[child.avatar] || avatarMap.Char1;
  console.log('[ChildCard] 🎭 Rendering avatar:', avatarSrc, 'for', child.childName);

  return (
    <div className="child-card" onClick={handleSelect}>
      {isSelected && (
        <div className="child-tools">
          <Edit3 size={18} onClick={handleEdit} />
          <Trash2 size={18} onClick={handleDelete} />
          <Users size={18} onClick={handleSwitch} title="Switch Child" />
          <LanguageToggle
            language={language}
            onChange={handleLanguageChange}
          />
        </div>
      )}

      <div className="child-avatar">
        <img
          src={avatarSrc}
          alt={child.childName}
          className="child-avatar-img"
        />
      </div>
      <span className="child-name">{child.childName}</span>
    </div>
  );
};

export default ChildCard;
