import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useSelectedChild from '../hooks/useSelectedChild';

const GAME_URL = 'https://learnifylevels.s3.us-east-1.amazonaws.com/test/index.html';

const MemoryGames = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedChildId } = useSelectedChild();
  const iframeRef = useRef(null);

  const childId = location.state?.childId || selectedChildId;

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSendMessage = () => {
    const message = {
      action: 'initialize',
      message: `Hello from React! Child ID: ${childId}`,
    };

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, GAME_URL);
      console.log('Message sent to game:', message);
    } else {
      console.warn('Iframe not available to send message.');
    }
  };

  useEffect(() => {
    const receiveMessageFromGame = (event) => {
      // Validate origin (IMPORTANT for security)
      if (event.origin !== 'https://learnifylevels.s3.us-east-1.amazonaws.com') {
        console.warn('Received message from unexpected origin:', event.origin);
        return;
      }

      console.log('Message received from game:', event.data);
      // Do something with the message if needed
    };

    window.addEventListener('message', receiveMessageFromGame);

    return () => {
      window.removeEventListener('message', receiveMessageFromGame);
    };
  }, []);

  return (
    <div>
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
        Back
      </button>

      <h1>MemoryGames Adventure for Child ID: {childId}</h1>

      <button onClick={handleSendMessage}>
        Send Message to Game
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
