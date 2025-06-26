// Adventures.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Adventures.css'; // Create this for styling
import '../components/bubble.css'; // ✅ correct path

const cardsData = [
  {
    id: 1,
    defaultImageUrl: "https://learnify2025.s3.us-east-1.amazonaws.com/adventures/language_learn.png",
    sound: "https://learnify2025.s3.us-east-1.amazonaws.com/sounds/click.mp3",
    text1: "Language",
    route: "/language_learn",
  },
  {
    id: 2,
    defaultImageUrl: "https://learnify2025.s3.us-east-1.amazonaws.com/adventures/math_learn.png",
    sound: "https://learnify2025.s3.us-east-1.amazonaws.com/sounds/click.mp3",
    text1: "Math",
    route: "/math_learn",
  },
  {
    id: 3,
    defaultImageUrl: "https://learnify2025.s3.us-east-1.amazonaws.com/adventures/logic_learn.png",
    sound: "https://learnify2025.s3.us-east-1.amazonaws.com/sounds/click.mp3",
    text1: "Logic",
    route: "/logic_learn",
  },
  {
    id: 4,
    defaultImageUrl: "https://learnify2025.s3.us-east-1.amazonaws.com/adventures/memorycards.png",
    sound: "https://learnify2025.s3.us-east-1.amazonaws.com/sounds/click.mp3",
    text1: "Memory",
    route: "/memory_subtypes", // 🔁 NEW intermediate route,
  },
];

const Adventures = ({ childId }) => {
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    const audio = new Audio(card.sound);
    audio.play();
    navigate(card.route, { state: { childId } });
  };

  return (
    <div className="adventures">
      <div className="cards-grid">
        {cardsData.map((card) => (
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

export default Adventures;
