// src/components/CelebrateModal.jsx
import './CelebrateModal.css';

const CelebrateModal = ({ onConfirm, onCancel }) => {
  // 🔊 Preload audio
  const playClickSound = new Audio('https://learnify2025.s3.us-east-1.amazonaws.com/sounds/click_play.mp3');
  const cancelClickSound = new Audio('https://learnify2025.s3.us-east-1.amazonaws.com/sounds/click_cancel.mp3');

  // ✅ Handle green button
  const handleConfirm = () => {
    playClickSound.currentTime = 0;
    playClickSound.play().catch(() => {}); // don't block
    setTimeout(() => {
      onConfirm();
    }, 200); // delay to let sound play
  };

  // ❌ Handle red button
  const handleCancel = () => {
    cancelClickSound.currentTime = 0;
    cancelClickSound.play().catch(() => {});
    setTimeout(() => {
      onCancel();
    }, 200);
  };

  return (
    <div className="logout-modal-overlay">
      <div className="celebrate-modal">
        <iframe
          src="https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/lemo_front/lemo_front.html?animation=applaus&scale=1"
          width="300"
          height="220"
          className="spineanimation-iframe"
          title="Lemo applaus"
          allowTransparency="true"
        ></iframe>

        <p>Play Again?</p>

        <div className="modal-buttons">
          <button className="circle-button green" onClick={handleConfirm} aria-label="Yes">
            ▶
          </button>
          <button className="circle-button red" onClick={handleCancel} aria-label="No">
            ✖
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrateModal;
