import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useSelectedChild from '../hooks/useSelectedChild';
import '../components/bubble.css';
import GlobalMenu from '../components/GlobalMenu';
import CelebrateModal from '../components/CelebrateModal';
import { ArrowLeft } from 'lucide-react';

import './MemoryGames.css';

const GAME_URL = 'https://learnifylevels.s3.us-east-1.amazonaws.com/memorycards/index.html';
const GAME_ORIGIN = new URL(GAME_URL).origin;

const ANIMATION_IFRAME_URL =
  'https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/playbuttun/lemo_playbuttun.html?animation=wait&scale=1.2';
const ANIMATION_ORIGIN = 'https://learnify2025.s3.us-east-1.amazonaws.com';

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
  const applauseAudio = useRef(null); // ✅ define useRef inside the component

  const [gameLoaded, setGameLoaded] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [audioMap, setAudioMap] = useState(new Map());
  const [showCelebration, setShowCelebration] = useState(false);

  const topic = location.state?.topic || 'colors';
  const { rows, cols } = difficultyLevels[levelIndex];
  const rawChildId = location.state?.childId || selectedChildId;
  const childId = rawChildId || 'default';


  // 🔊 Preload applause sound
  useEffect(() => {
    applauseAudio.current = new Audio('https://learnify2025.s3.us-east-1.amazonaws.com/sounds/applause_cheer.mp3');
  }, []);

  useEffect(() => {
    const lang = localStorage.getItem('language') || 'en';
    if (lang === 'no' || lang === 'off') {
      console.log('🔇 Audio loading skipped (language is muted)');
      return;
    }

    const loadAudioFiles = async () => {
      try {
        const res = await fetch('https://hjpuilfc33.execute-api.us-east-1.amazonaws.com/prod/public?category=colors');
        const data = await res.json();
        const map = new Map();

        for (const item of data.items) {
          const colorName = item.sprName.toLowerCase();
          const audioUrl = `${item.soundLocation}${lang}/${colorName}.mp3`;
          const audio = new Audio(audioUrl);
          map.set(colorName, audio);
        }

        setAudioMap(map);
        console.log('🎧 Audio files loaded for language:', lang);
      } catch (error) {
        console.error('❌ Failed to preload audio:', error);
      }
    };

    loadAudioFiles();
  }, []);

  const handleFullscreenBack = () => {
    if (gameIframeRef.current?.contentWindow) {
      const resetMessage = {
        action: 'setup',
        payload: { rows: 0, cols: 0, childId, topic },
      };
      gameIframeRef.current.contentWindow.postMessage(resetMessage, GAME_ORIGIN);
      console.log('🔄 Reset message sent:', resetMessage);
    }
    setShowGame(false);
  };

  const sendGameSetup = () => {
    const configMessage = {
      action: 'setup',
      payload: { rows, cols, childId, topic },
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

      if (parsedData?.action === 'update' && parsedData.loaded === 1) {
        setGameLoaded(true);
        switchAnimation('idle');
      }

      if (parsedData?.action === 'talk' && parsedData.color) {
        const color = parsedData.color.toLowerCase();
        const audio = audioMap.get(color);
        if (audio) {
          audio.currentTime = 0;
          setTimeout(() => {
            audio.play().catch((e) => console.warn('⚠️ Playback error:', e));
          }, 350);
        } else {
          console.warn('⚠️ No audio found for:', color);
        }
      }

      // ✅ Handle game completion
      if (parsedData?.action === 'update' && parsedData.completed === 1) {
        console.log('🎯 Game completed received from game iframe:', parsedData);
        setShowCelebration(true);
      }

      // 🔊 Handle applause sound trigger from game
      if (parsedData?.action === 'play' && parsedData.sound === 'applause_cheer') {
        console.log('🔊 Playing applause sound from game trigger');
        const applause = applauseAudio.current;
        if (applause) {
          applause.currentTime = 0;
          applause.play().catch((e) => console.warn('⚠️ Applause sound failed:', e));
        }
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
  }, [audioMap]);

  return (
     <div>
          <button className="back-button" onClick={() => navigate(-1)}>
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
