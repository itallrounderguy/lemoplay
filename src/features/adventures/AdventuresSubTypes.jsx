import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "@styles/Adventures.css";

import { ArrowLeft } from 'lucide-react';

const subCardsData = [
  {
    id: 1,
    text1: 'Colors',
    defaultImageUrl: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/colors.png',
    value: 'colors',
    soundBase: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/colors_',
  },
  {
    id: 2,
    text1: 'Shapes',
    defaultImageUrl: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/shapes.png',
    value: 'shapes',
    soundBase: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/shapes_',
  },
  {
    id: 3,
    text1: 'Fruits',
    defaultImageUrl: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/fruits.png',
    value: 'fruits',
    soundBase: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/fruitsandvegs_',
  },
  {
    id: 4,
    text1: 'Animals',
    defaultImageUrl: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/animals.png',
    value: 'animals',
    soundBase: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/animals_',
  },
  {
    id: 5,
    text1: 'Transport',
    defaultImageUrl: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/transport.png',
    value: 'transport',
    soundBase: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/transportation_',
  },
];

const AdventuresSubTypes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const childId = location.state?.childId || 'default';
  const lang = localStorage.getItem('language') || 'en';

  const handleCardClick = (subCard) => {
    if (subCard.soundBase) {
      const audio = new Audio(`${subCard.soundBase}${lang}.mp3`);
      audio.play().catch((err) => console.warn('Audio play failed:', err));
    }

    navigate('/memory_games', {
      state: {
        childId,
        topic: subCard.value,
      },
    });
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
        Back
      </button>
      <div className="adventures">
        <div className="lemo-bubble">Choose a topic:</div>
        <div className="cards-grid">
          {subCardsData.map((card) => (
            <div
              key={card.id}
              className="adventure-card"
              onClick={() => handleCardClick(card)}
            >
              <img src={card.defaultImageUrl} alt={card.text1} />
              <p>{card.text1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdventuresSubTypes;
