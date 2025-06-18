import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useSelectedChild from '../hooks/useSelectedChild';
import '../components/bubble.css';
import GlobalMenu from '../components/GlobalMenu';
import './MemoryGames.css';

const GAME_URL = 'https://learnifylevels.s3.us-east-1.amazonaws.com/memorycards/index.html';
const GAME_ORIGIN = new URL(GAME_URL).origin;

const ANIMATION_IFRAME_URL =
  'https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/playbuttun/lemo_playbuttun.html?animation=wait&scale=1.2';
const ANIMATION_ORIGIN = 'https://learnify2025.s3.us-east-1.amazonaws.com';

// 🎮 Difficulty levels with emojis
const difficultyLevels = [
  { label: '🐣 Baby', rows: 2, cols: 2 },
  { label: '🧒 Learner', rows: 2, cols: 3 },
  { label: '🧠 Smart', rows: 2, cols: 4 },
  { label: '🤯 Genius', rows: 3, cols: 4 },
  { label: '👽 Alien', rows: 4, cols: 4 },
];

const MemoryGames = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedChildId } = useSelectedChild();

  const gameIframeRef = useRef(null);
  const animIframeRef = useRef(null);

  const [gameLoaded, setGameLoaded] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);

  const { rows, cols, label } = { ...difficultyLevels[levelIndex] };

  const rawChildId = location.state?.childId || selectedChildId;
  const childId = rawChildId || 'default';

  const handleBack = () => navigate('/dashboard');
  const handleFullscreenBack = () => setShowGame(false);

  const sendGameSetup = () => {
    const configMessage = {
      action: 'setup',
      payload: { rows, cols, childId },
    };

    if (gameIframeRef.current?.contentWindow) {
      gameIframeRef.current.contentWindow.postMessage(configMessage, GAME_ORIGIN);
      console.log('✅ Game setup message sent:', configMessage);
    }
  };

  const handlePlayClick = () => {
    if (gameLoaded) {
      sendGameSetup();
      setShowGame(true);
    }
  };

  const switchAnimation = (animationName) => {
    if (animIframeRef.current?.contentWindow) {
      animIframeRef.current.contentWindow.postMessage(
        { action: 'changeAnimation', animation: animationName },
        ANIMATION_ORIGIN
      );
    }
  };

  useEffect(() => {
    const receiveMessageFromGame = (event) => {
      if (event.origin !== GAME_ORIGIN) return;

      let parsedData = event.data;
      if (typeof parsedData === 'string') {
        try {
          parsedData = JSON.parse(parsedData);
        } catch {
          return;
        }
      }

      if (parsedData?.action === 'update' && parsedData?.loaded === 1) {
        setGameLoaded(true);
        switchAnimation('idle');
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowGame(false);
    };

    window.addEventListener('message', receiveMessageFromGame);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('message', receiveMessageFromGame);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="memory-container">
      <GlobalMenu />

      <div className="lemo-bubble">Choose difficulty:</div>

      <div className="lemo-slider-container">
        <div className="slider-group">
          <div className="slider-wrapper">
            <input
              type="range"
              min="0"
              max={difficultyLevels.length - 1}
              step="1"
              value={levelIndex}
              onChange={(e) => setLevelIndex(parseInt(e.target.value, 10))}
              aria-label="Difficulty Level"
            />

            <div className="slider-labels">
              {difficultyLevels.map((level, index) => (
                <span
                  key={index}
                  className={`slider-label ${index === levelIndex ? 'active' : ''}`}
                  style={{ left: `${(index / (difficultyLevels.length - 1)) * 100}%` }}
                >
                  {level.label}
                </span>
              ))}
            </div>
          </div>

          <div
            className="play-button-wrapper"
            onClick={handlePlayClick}
            style={{
              cursor: gameLoaded ? 'pointer' : 'not-allowed',
              opacity: gameLoaded ? 1 : 0.5,
              pointerEvents: gameLoaded ? 'auto' : 'none',
            }}
          >
            <iframe
              ref={animIframeRef}
              src={ANIMATION_IFRAME_URL}
              width="280"
              height="240"
              className="logo-iframe"
              title="play"
              allowTransparency="true"
              style={{ pointerEvents: 'none' }}
            ></iframe>
          </div>
        </div>
      </div>

      {/* Game iframe */}
      <div className={`fullscreen-game-wrapper ${showGame ? 'visible' : 'hidden'}`}>
        <div className="fullscreen-menu">
          <GlobalMenu />
        </div>

        <iframe
          ref={gameIframeRef}
          src={GAME_URL}
          title="Memory Game"
          className="fullscreen-game"
        ></iframe>
      </div>
    </div>
  );
};

export default MemoryGames;
