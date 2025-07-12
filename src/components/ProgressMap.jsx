import React from 'react';
import './ProgressMap.css';

const NUM_TILES = 8; // You can change how many tiles to show

const ProgressMap = ({ onTileClick }) => {
  const tiles = Array.from({ length: NUM_TILES }, (_, i) => ({
    id: `tile-${i + 1}`,
    image: 'https://learnify2025.s3.us-east-1.amazonaws.com/progress_maps/burg.png',
    label: `Level ${i + 1}`,
  }));

  return (
    <div className="map-container">
      {tiles.map(tile => (
        <div key={tile.id} className="tile" onClick={() => onTileClick(tile.id)}>
          <img src={tile.image} alt={tile.label} className="tile-img" />
          <div className="tile-label">{tile.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressMap;
