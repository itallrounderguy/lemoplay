import { useEffect } from 'react';

const Preloader = () => {
  useEffect(() => {
    // Preload Spine runtime assets (optional optimization)
    fetch('https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/iife/spine-player.js');
    fetch('https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/spine-player.css');

    // ✅ Preload the intro1 animation iframe
    const introIframe = document.createElement('iframe');
    introIframe.src = 'https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/intro1/intro1.html';
    introIframe.style.display = 'none';
    introIframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(introIframe);

    // ✅ Preload the Lemo front animation iframe
    const lemoIframe = document.createElement('iframe');
    lemoIframe.src = 'https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/lemo_front/lemo_front.html?animation=idle&scale=1';
    lemoIframe.style.display = 'none';
    lemoIframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(lemoIframe);

    return () => {
      document.body.removeChild(introIframe);
      document.body.removeChild(lemoIframe);
    };
  }, []);

  return <div>{/* Optional loading spinner here */}</div>;
};

export default Preloader;
