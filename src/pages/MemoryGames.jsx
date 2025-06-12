import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useSelectedChild from '../hooks/useSelectedChild';

const GAME_URL = 'https://learnifylevels.s3.us-east-1.amazonaws.com/memorycards/index.html';

const MemoryGames = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedChildId } = useSelectedChild();
  const iframeRef = useRef(null);

  const [gameLoaded, setGameLoaded] = useState(false);

  const childId = location.state?.childId || selectedChildId;

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSendGameSetup = () => {
    const configMessage = {
      action: 'setup',
      payload: {
        rows: 3,
        cols: 4,
        childId: childId || 'unknown-child',
      },
    };

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(configMessage, 'https://learnifylevels.s3.us-east-1.amazonaws.com');
      console.log('✅ Game setup message sent:', configMessage);
    } else {
      console.warn('⚠️ Iframe not available to send game setup.');
    }
  };

  useEffect(() => {
    const receiveMessageFromGame = (event) => {
      if (event.origin !== 'https://learnifylevels.s3.us-east-1.amazonaws.com') {
        console.warn('🚫 Blocked message from unknown origin:', event.origin);
        return;
      }

      console.log('📩 Message received from game:', event.data);

      let parsedData = event.data;
      if (typeof parsedData === 'string') {
        try {
          parsedData = JSON.parse(parsedData);
        } catch (e) {
          console.warn('❌ Could not parse JSON from game:', event.data);
          return;
        }
      }

      if (parsedData?.action === 'update' && parsedData?.loaded === 1) {
        console.log('✅ Game is loaded.');
        setGameLoaded(true);
      }
    };

    window.addEventListener('message', receiveMessageFromGame);
    return () => window.removeEventListener('message', receiveMessageFromGame);
  }, []);

  return (
    <div>
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
        Back
      </button>

      <h1>MemoryGames Adventure for Child ID: {childId}</h1>

      <p>Status: {gameLoaded ? '✅ Game Loaded' : '⏳ Waiting for Game to Load'}</p>

      <button onClick={handleSendGameSetup} disabled={!gameLoaded}>
        Send Game Setup to Game
      </button>

      <div style={{ marginTop: '20px', height: '80vh' }}>
        <iframe
          ref={iframeRef}
          src={GAME_URL}
          title="Memory Game"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default MemoryGames;
