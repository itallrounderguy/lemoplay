import React, { useEffect, useRef, useState } from 'react';
import './ProgressMap.css';

const NUM_TILES = 8;

const ProgressMap = ({ onTileClick }) => {
  const languageLearnLevel = parseInt(localStorage.getItem('languageLearnLevel') || '1', 10);

  const currentAvatar = localStorage.getItem('avatar') || 'Char1';
  const avatar = currentAvatar.trim();

  console.log('[ProgressMap] ⛳ languageLearnLevel:', languageLearnLevel);
  console.log('[ProgressMap] 🧍 currentAvatar from localStorage:', currentAvatar);
  console.log('[ProgressMap] 🧍 trimmed avatar:', avatar);

  const animationUrl = `https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/${avatar.toLowerCase()}/${avatar.toLowerCase()}.html?scale=0.5`;

  console.log('[ProgressMap] 🎬 animationUrl:', animationUrl);

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

  useEffect(() => {
    const tileEl = currentTileRef.current;
    const mapEl = mapRef.current;
    if (!tileEl || !mapEl) return;

    // Auto-scroll to current level
    tileEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

    const iframeWidth = 256;
    const iframeHeight = 256;

    const centerX = tileEl.offsetLeft + tileEl.offsetWidth / 2;
    const centerY = tileEl.offsetTop + tileEl.offsetHeight / 2;

    // Animate in from top
    setAnimPos({
      left: centerX - iframeWidth / 2,
      top: -iframeHeight,
      visible: true,
    });

    setTimeout(() => {
      setAnimPos({
        left: centerX - iframeWidth / 2,
        top: centerY - iframeHeight / 2,
        visible: true,
      });
    }, 50);
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

      {animPos.visible && (
        <iframe
          ref={animRef}
          className="map-animation flying-in"
          src={animationUrl}
          title="Jetpack Lemo"
          width="256"
          height="256"
          style={{
            position: 'absolute',
            left: animPos.left,
            top: animPos.top,
            pointerEvents: 'none',
            zIndex: 10,
            //transform: 'scaleX(-1)',
            border: 'none',
            transition: 'top 1s ease-out',
          }}
        />
      )}
    </div>
  );
};

export default ProgressMap;
