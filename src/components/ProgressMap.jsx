import React, { useEffect, useRef } from 'react';
import './ProgressMap.css';

const NUM_TILES = 8;

const ProgressMap = ({ onTileClick }) => {
  const languageLearnLevel = parseInt(localStorage.getItem('languageLearnLevel') || '1', 10);
  const mapRef = useRef(null);
  const currentTileRef = useRef(null);

  const tiles = Array.from({ length: NUM_TILES }, (_, i) => {
    const level = i + 1;
    return {
      id: `tile-${level}`,
      image: 'https://learnify2025.s3.us-east-1.amazonaws.com/progress_maps/burg.png',
      label: `Level ${level}`,
      level,
    };
  });

  useEffect(() => {
    if (currentTileRef.current) {
      currentTileRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, []);

  return (
    <div className="map-container" ref={mapRef}>
      {tiles.map(tile => (
        <div
          key={tile.id}
          className={`tile ${tile.level > languageLearnLevel ? 'locked' : ''}`}
          onClick={() => tile.level <= languageLearnLevel && onTileClick(tile.id)}
          ref={tile.level === languageLearnLevel ? currentTileRef : null}
        >
          <img src={tile.image} alt={tile.label} className="tile-img" />
          <div className="tile-label">{tile.label}</div>
          {tile.level === languageLearnLevel && <div className="tile-marker pulse">🎯</div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressMap;
