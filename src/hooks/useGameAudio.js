import { useEffect, useState } from 'react';

export const useGameAudio = (language = 'en', topic = 'colors') => {
  const [audioMap, setAudioMap] = useState(new Map());

  useEffect(() => {
    if (language === 'off' || language === 'no') {
      console.log('🔇 Audio loading skipped');
      return;
    }

    if (!topic) {
      console.warn('⚠️ No topic provided for audio loading.');
      return;
    }

    const AUDIO_API = `https://hjpuilfc33.execute-api.us-east-1.amazonaws.com/prod/public?category=${topic}`;

    const loadAudio = async () => {
      try {
        const res = await fetch(AUDIO_API);
        const data = await res.json();
        const map = new Map();

        data.items.forEach(item => {
          const name = item.sprName?.toLowerCase?.();
          const url = `${item.soundLocation}${language}/${name}.mp3`;
          if (name && url) {
            map.set(name, new Audio(url));
          }
        });

        setAudioMap(map);
        console.log(`🎧 Audio loaded for topic: ${topic}, language: ${language}`);
      } catch (err) {
        console.error('❌ Audio loading error:', err);
      }
    };

    loadAudio();
  }, [language, topic]);

  return audioMap;
};
