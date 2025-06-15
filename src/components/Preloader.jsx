import { useEffect } from 'react';

const Preloader = () => {
  useEffect(() => {
    // ✅ Preload Spine runtime assets
    fetch('https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/iife/spine-player.js');
    fetch('https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/spine-player.css');

    // ✅ Preload Spine animation iframes
    const introIframe = document.createElement('iframe');
    introIframe.src = 'https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/intro1/intro1.html';
    introIframe.style.display = 'none';
    introIframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(introIframe);

    const lemoIframe = document.createElement('iframe');
    lemoIframe.src = 'https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/lemo_front/lemo_front.html?animation=idle&scale=1';
    lemoIframe.style.display = 'none';
    lemoIframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(lemoIframe);

    const playbuttunframe = document.createElement('iframe');
    playbuttunframe.src = 'https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/playbuttun/lemo_playbuttun.html?animation=idle&scale=1.2';
    playbuttunframe.style.display = 'none';
    playbuttunframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(playbuttunframe);

    // ✅ Preload adventure card images
    const cardImageUrls = [
      "https://learnify2025.s3.us-east-1.amazonaws.com/adventures/language_learn.png",
      "https://learnify2025.s3.us-east-1.amazonaws.com/adventures/math_learn.png",
      "https://learnify2025.s3.us-east-1.amazonaws.com/adventures/logic_learn.png",
      "https://learnify2025.s3.us-east-1.amazonaws.com/adventures/memorycards.png"
    ];

    const preloadedImages = cardImageUrls.map((url) => {
      const img = new Image();
      img.src = url;
      return img;
    });

    // ✅ Cleanup
    return () => {
      document.body.removeChild(introIframe);
      document.body.removeChild(lemoIframe);
      document.body.removeChild(playbuttunframe);
      // No need to cleanup preloadedImages, garbage collector handles them
    };
  }, []);

  return <div>{/* Optional spinner or splash screen */}</div>;
};

export default Preloader;
