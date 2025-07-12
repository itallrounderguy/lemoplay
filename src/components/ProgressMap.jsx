import React, { useEffect, useRef, useState } from 'react';
import './ProgressMap.css';

const NUM_TILES = 8;

const ProgressMap = ({ onTileClick }) => {
  const languageLearnLevel = parseInt(localStorage.getItem('languageLearnLevel') || '1', 10);
  const mapRef = useRef(null);
  const currentTileRef = useRef(null);
  const animRef = useRef(null);
  const [animPos, setAnimPos] = useState({ left: 0, top: 0, visible: false });

  const tiles = Array.from({ length: NUM_TILES }, (_, i) => {
    const level = i + 1;
    return {
      id: `tile-${level}`,
      image: 'https://learnify2025.s3.us-east-1.amazonaws.com/progress_maps/burg.png',
      label: `Level ${level}`,
      level,
    };
  });

  // Scroll and position iframe on mount
  useEffect(() => {
    const updateAnimPosition = () => {
  const tileEl = currentTileRef.current;
  const mapEl = mapRef.current;
  if (!tileEl || !mapEl) return;

  const iframeWidth = 256;
  const iframeHeight = 256;

const tileRect = tileEl.getBoundingClientRect();
const mapRect = mapEl.getBoundingClientRect();

const scrollLeft = mapEl.scrollLeft;
const scrollTop = mapEl.scrollTop;

const centerX = tileEl.offsetLeft + tileEl.offsetWidth / 2;
const centerY = tileEl.offsetTop + tileEl.offsetHeight / 2;

setAnimPos({
  left: centerX - 128, // iframeWidth / 2
  top: centerY - 128,  // iframeHeight / 2
  visible: true,
});

};


    updateAnimPosition();
    window.addEventListener('resize', updateAnimPosition);

    return () => window.removeEventListener('resize', updateAnimPosition);
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

      {/* 🪂 Animation over current tile */}
      {animPos.visible && (
        <iframe
          ref={animRef}
          className="map-animation"
          src="https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/char_1/char_1.html?animation=JetPack&scale=0.5"
          title="Jetpack Lemo"
          width="256"
          height="256"
          style={{
            position: 'absolute',
            left: animPos.left,
            top: animPos.top,
            pointerEvents: 'none',
            zIndex: 10,
            transform: 'scaleX(-1)', // ✅ flips horizontally
          }}
        />
      )}
    </div>
  );
};

export default ProgressMap;
