import React from 'react';
import './ProgressMap.css';

const NUM_TILES = 8; // You can change how many tiles to show

const ProgressMap = ({ onTileClick }) => {
  const languageLearnLevel = parseInt(localStorage.getItem('languageLearnLevel') || '1', 10);

  const tiles = Array.from({ length: NUM_TILES }, (_, i) => {
    const level = i + 1;
    return {
      id: `tile-${level}`,
      image: 'https://learnify2025.s3.us-east-1.amazonaws.com/progress_maps/burg.png',
      label: `Level ${level}`,
      level,
    };
  });

  return (
    <div className="map-container">
      {tiles.map(tile => (
        <div
          key={tile.id}
          className={`tile ${tile.level > languageLearnLevel ? 'locked' : ''}`}
          onClick={() => tile.level <= languageLearnLevel && onTileClick(tile.id)}
        >
          <img src={tile.image} alt={tile.label} className="tile-img" />
          <div className="tile-label">{tile.label}</div>
          {tile.level === languageLearnLevel && <div className="tile-marker">🎯</div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressMap;
