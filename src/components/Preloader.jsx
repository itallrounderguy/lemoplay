// src/pages/Preloader.jsx
import { useEffect } from 'react';

const Preloader = () => {
  useEffect(() => {
    // Preload Spine assets
    fetch('https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/iife/spine-player.js');
    fetch('https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/spine-player.css');

    // Preload the animation iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://learnify2025.s3.us-east-1.amazonaws.com/modalsanimation/logout/logout.html';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    return () => {
      document.body.removeChild(iframe);
    };
  }, []);

  return (
    
    <div>
      {/* Optional loading animation */}
    </div>
    
  );
};

export default Preloader;
