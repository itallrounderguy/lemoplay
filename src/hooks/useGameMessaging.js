import { useEffect } from 'react';

export const useGameMessaging = ({
  audioMap,
  setGameLoaded,
  setShowCelebration,
  applauseAudio,
  switchAnimation,
  sendGameSetup, // ✅ Accept sendGameSetup
}) => {
  useEffect(() => {
    const GAME_ORIGIN = 'https://learnifylevels.s3.us-east-1.amazonaws.com';

    const receiveMessage = (event) => {
      if (event.origin !== GAME_ORIGIN) return;

      let data = event.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      if (data?.action === 'update' && data.loaded === 1) {
        setGameLoaded(true);
        switchAnimation?.('idle');
        sendGameSetup?.(); // ✅ Send setup message right when game is loaded
      }

      if (data?.action === 'talk' && data.color) {
        const sound = audioMap.get(data.color.toLowerCase());
        if (sound) {
          sound.currentTime = 0;
          setTimeout(() => sound.play().catch(console.warn), 350);
        }
      }

      if (data?.action === 'update' && data.completed === 1) {
        setShowCelebration(true);
      }

      if (data?.action === 'play' && data.sound === 'applause_cheer') {
        const applause = applauseAudio.current;
        if (applause) {
          applause.currentTime = 0;
          applause.play().catch(console.warn);
        }
      }
    };

    const escHandler = (e) => {
      if (e.key === 'Escape') setShowCelebration(false);
    };

    window.addEventListener('message', receiveMessage);
    window.addEventListener('keydown', escHandler);
    return () => {
      window.removeEventListener('message', receiveMessage);
      window.removeEventListener('keydown', escHandler);
    };
  }, [audioMap, setGameLoaded, setShowCelebration, applauseAudio, switchAnimation, sendGameSetup]);
};
