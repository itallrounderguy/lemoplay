// AdventuresSubTypes.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Adventures.css'; // Reuse existing styles

const subCardsData = [
  {
    id: 1,
    text1: 'Colors',
    defaultImageUrl: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/colors.png',
    value: 'colors',
  },
  {
    id: 2,
    text1: 'Shapes',
    defaultImageUrl: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/shapes.png',
    value: 'shapes',
  },
  {
    id: 3,
    text1: 'Fruits',
    defaultImageUrl: 'https://learnify2025.s3.us-east-1.amazonaws.com/adventures/fruits.png',
    value: 'fruits',
  },
];

const AdventuresSubTypes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const childId = location.state?.childId || 'default';

  const handleCardClick = (subCard) => {
    navigate('/memory_games', {
      state: {
        childId,
        topic: subCard.value,
      },
    });
  };

  return (
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
  );
};

export default AdventuresSubTypes;
