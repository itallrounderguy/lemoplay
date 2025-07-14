import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useGameMessaging } from '@hooks/useGameMessaging';
import { useGameAudio } from '@hooks/useGameAudio';
import useSelectedChild from '@hooks/useSelectedChild';

import { GAME_URL, GAME_ORIGIN, ANIMATION_IFRAME_URL, DIFFICULTY_LEVELS } from '@hooks/memoryGame';

import GlobalMenu from '@components/layout/GlobalMenu';
import CelebrateModal from '@components/ui/CelebrateModal';

import { ArrowLeft } from 'lucide-react';

import '@styles/MemoryGames.css'; // ✅ correct alias path

import '@styles/bubble.css'; // Global style path, or update as needed

const MemoryGames = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedChildId } = useSelectedChild();

  const gameIframeRef = useRef(null);
  const animIframeRef = useRef(null);
  const applauseAudio = useRef(null);

  const [gameLoaded, setGameLoaded] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [levelIndex, setLevelIndex] = useState(Math.floor(DIFFICULTY_LEVELS.length / 2));
  const [showCelebration, setShowCelebration] = useState(false);

  const topic = location.state?.topic || 'nothing';
  const lang = localStorage.getItem('language') || 'en';
  const audioMap = useGameAudio(lang, topic);

  const { rows, cols } = DIFFICULTY_LEVELS[levelIndex];
  const rawChildId = location.state?.childId || selectedChildId;
  const childId = rawChildId || 'default';

  const handleBack = () => navigate(-1);

  useEffect(() => {
    applauseAudio.current = new Audio(
      'https://learnify2025.s3.us-east-1.amazonaws.com/sounds/applause_cheer.mp3'
    );
  }, []);

  const sendGameSetup = () => {
    const configMessage = {
      action: 'setup',
      payload: { rows, cols, childId, topic },
    };
    gameIframeRef.current?.contentWindow?.postMessage(configMessage, GAME_ORIGIN);
  };

  const switchAnimation = (animationName) => {
    animIframeRef.current?.contentWindow?.postMessage(
      { action: 'changeAnimation', animation: animationName },
      '*'
    );
  };

  useGameMessaging({
    audioMap,
    setGameLoaded,
    setShowCelebration,
    applauseAudio,
    switchAnimation,
    sendGameSetup,
  });

  const handlePlayClick = () => {
    if (gameLoaded) {
      sendGameSetup();
      setShowGame(true);
    }
  };

  const handleFullscreenBack = () => {
    const resetMessage = {
      action: 'setup',
      payload: { rows: 0, cols: 0, childId, topic },
    };
    gameIframeRef.current?.contentWindow?.postMessage(resetMessage, GAME_ORIGIN);
    setShowGame(false);
  };

    return (
    <div>
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
        Back
      </button>

      <div className="memory-container">
        <GlobalMenu />
        <div className="lemo-bubble">Choose difficulty:</div>

        <div className="lemo-slider-container">
          <div className="slider-section">
            <div className="slider-group">
              <div className="slider-wrapper">
                <input
                  type="range"
                  min="0"
                  max={DIFFICULTY_LEVELS.length - 1}
                  step="1"
                  value={levelIndex}
                  onChange={(e) => setLevelIndex(parseInt(e.target.value, 10))}
                  aria-label="Difficulty Level"
                />
                <div className="slider-labels">
                  {DIFFICULTY_LEVELS.map((level, index) => (
                    <span
                      key={index}
                      className={`slider-label ${index === levelIndex ? 'active' : ''}`}
                      style={{ left: `${(index / (DIFFICULTY_LEVELS.length - 1)) * 100}%` }}
                    >
                      {level.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`play-button-wrapper ${gameLoaded ? 'enabled' : 'disabled'}`}
              onClick={handlePlayClick}
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

        <div className={`fullscreen-game-wrapper ${showGame ? 'visible' : 'hidden'}`}>
          <div className="fullscreen-menu back-button-container">
            <button className="back-button" onClick={handleFullscreenBack} aria-label="Go back">
              ←
            </button>
          </div>

          <iframe
            ref={gameIframeRef}
            src={GAME_URL}
            title="Memory Game"
            className="fullscreen-game"
            onError={() => console.error('❌ Game iframe failed to load')}
          ></iframe>

          {showCelebration && (
            <CelebrateModal
              onConfirm={() => {
                setShowCelebration(false);
                sendGameSetup();
              }}
              onCancel={() => navigate(-1)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryGames;
