import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useSelectedChild from '../hooks/useSelectedChild';
import '../components/bubble.css';
import './MemoryGames.css';

const GAME_URL = 'https://learnifylevels.s3.us-east-1.amazonaws.com/memorycards/index.html';
const GAME_ORIGIN = new URL(GAME_URL).origin;

const ANIMATION_IFRAME_URL = 'https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/playbuttun/lemo_playbuttun.html?animation=wait&scale=1.2';
const ANIMATION_ORIGIN = 'https://learnify2025.s3.us-east-1.amazonaws.com';

const allowedValues = [4, 6, 8, 10, 12, 14, 16, 18, 20];

const MemoryGames = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedChildId } = useSelectedChild();

  const gameIframeRef = useRef(null);
  const animIframeRef = useRef(null);

  const [gameLoaded, setGameLoaded] = useState(false);
  const [gameVisible, setGameVisible] = useState(false);
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);

  const rawChildId = location.state?.childId || selectedChildId;
  const childId = rawChildId || 'default';

  const handleBack = () => navigate('/dashboard');

  const sendGameSetup = () => {
    const configMessage = {
      action: 'setup',
      payload: {
        rows,
        cols,
        childId,
      },
    };

    if (gameIframeRef.current?.contentWindow) {
      gameIframeRef.current.contentWindow.postMessage(
        configMessage,
        GAME_ORIGIN
      );
      console.log('✅ Game setup message sent:', configMessage);
    }
  };

  const handlePlayClick = () => {
    if (gameLoaded) {
      sendGameSetup();
      setGameVisible(true);
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
      if (event.origin !== GAME_ORIGIN) {
        console.warn('🚫 Ignored message from unknown origin:', event.origin);
        return;
      }

      let parsedData = event.data;
      if (typeof parsedData === 'string') {
        try {
          parsedData = JSON.parse(parsedData);
        } catch (e) {
          console.warn('❌ Failed to parse message:', event.data);
          return;
        }
      }

      if (parsedData?.action === 'update' && parsedData?.loaded === 1) {
        setGameLoaded(true);
        switchAnimation('idle');
      }
    };

    window.addEventListener('message', receiveMessageFromGame);
    return () => window.removeEventListener('message', receiveMessageFromGame);
  }, []);

  return (
    <div className="memory-container">
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
        Back
      </button>

      <div className="lemo-bubble">How many cards to play with?</div>

      <div className="lemo-slider-container">
        <div className="slider-group">
          <input
            type="range"
            min="0"
            max={allowedValues.length - 1}
            step="1"
            value={allowedValues.indexOf(rows)}
            onChange={(e) => {
              const value = allowedValues[parseInt(e.target.value, 10)];
              setRows(value);
              setCols(value);
            }}
          />
          <div className="slider-value">Selected: {rows}</div>

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
              width="200"
              height="160"
              className="logo-iframe"
              title="play"
              allowTransparency="true"
              style={{ pointerEvents: 'none' }}
            ></iframe>
          </div>
        </div>
      </div>

      <div className="debug">
        <p><strong>Rows:</strong> {rows}</p>
        <p><strong>Cols:</strong> {cols}</p>
        <p><strong>Child ID:</strong> {childId}</p>
      </div>

      {/* Always render iframe, but control visibility */}
      <div
      className={`game-frame-wrapper ${gameVisible ? 'fade-in' : ''}`}
      style={{ display: gameVisible ? 'flex' : 'none' }}
    >
      <iframe
        ref={gameIframeRef}
        src={GAME_URL}
        title="Memory Game"
        className="game-iframe"
      ></iframe>
    </div>
    </div>
  );
};

export default MemoryGames;
