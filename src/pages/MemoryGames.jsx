import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useSelectedChild from '../hooks/useSelectedChild';
import '../components/bubble.css';
import './MemoryGames.css';

const GAME_URL = 'https://learnifylevels.s3.us-east-1.amazonaws.com/memorycards/index.html';
const allowedValues = [4, 6, 8, 10, 12, 14, 16, 18, 20];

const MemoryGames = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedChildId } = useSelectedChild();
  const iframeRef = useRef(null);

  const [gameLoaded, setGameLoaded] = useState(false);
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);

  const childId = location.state?.childId || selectedChildId;

  const handleBack = () => navigate('/dashboard');

  const sendGameSetup = () => {
    const configMessage = {
      action: 'setup',
      payload: {
        rows,
        cols,
        childId: childId || 'default',
      },
    };

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        configMessage,
        'https://learnifylevels.s3.us-east-1.amazonaws.com'
      );
      console.log('✅ Game setup message sent:', configMessage);
    }
  };

  const handlePlayClick = () => {
    if (gameLoaded) {
      sendGameSetup();
    }
  };

  useEffect(() => {
    const receiveMessageFromGame = (event) => {
      if (event.origin !== 'https://learnifylevels.s3.us-east-1.amazonaws.com') {
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
              src={`https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/playbuttun/lemo_playbuttun.html?animation=${gameLoaded ? 'idle' : 'wait'}&scale=1.2`}
              width="200"
              height="160"
              className="logo-iframe"
              title="play"
              allowTransparency="true"
              style={{ pointerEvents: 'none' }} // Makes iframe visually interactive but click goes to wrapper
            ></iframe>
          </div>
        </div>
      </div>

      <div className="debug">
        <p><strong>Rows:</strong> {rows}</p>
        <p><strong>Cols:</strong> {cols}</p>
        <p><strong>Child ID:</strong> {childId || 'default'}</p>
      </div>

      <div className="game-frame-wrapper">
        <iframe
          ref={iframeRef}
          src={GAME_URL}
          title="Memory Game"
          className="game-iframe"
        ></iframe>
      </div>
    </div>
  );
};

export default MemoryGames;
