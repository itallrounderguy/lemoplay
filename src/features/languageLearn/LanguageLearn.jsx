import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useSelectedChild from '../../hooks/useSelectedChild';
import ProgressMap from "./ProgressMap";



const LANGUAGE_GAME_URL = "https://learnifylevels.s3.us-east-1.amazonaws.com/LanguageLearn/alphabets/index.html";

const LanguageLearn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedChildId } = useSelectedChild();

  const childId = location.state?.childId || selectedChildId;

  const [showGame, setShowGame] = useState(false);

  const handleBack = () => {
    if (showGame) {
      setShowGame(false); // Exit fullscreen game
    } else {
      navigate('/dashboard');
    }
  };

  const handleTileClick = (tileId) => {
    console.log('[LanguageLearn] 🟦 Tile clicked:', tileId);
    // You can expand this to navigate to lesson pages later
  };

  const handlePlayTile = (tile) => {
    console.log('[LanguageLearn] ▶️ Playing game for tile 1:', tile);
    setShowGame(true);
  };

  return (
    <div>
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
        Back
      </button>

      <h1 style={{ marginLeft: '1rem' }}>Language Progress</h1>

      {!showGame && (
        <ProgressMap
          onTileClick={handleTileClick}
          onPlayTile={handlePlayTile} // ✅ Trigger fullscreen on tile 1
        />
      )}

      {showGame && (
        <div className="fullscreen-game-wrapper visible">
          <div className="fullscreen-menu back-button-container">
            <button className="back-button" onClick={handleBack} aria-label="Go back">
              ←
            </button>
          </div>
          <iframe
            src={LANGUAGE_GAME_URL}
            title="Language Game"
            className="fullscreen-game"
            allow="fullscreen"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default LanguageLearn;
