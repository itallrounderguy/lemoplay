// src/components/CelebrateModal.jsx
import './CelebrateModal.css'; // still using LogoutModal styles

const CelebrateModal = ({ onConfirm, onCancel }) => {
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
          <button className="circle-button green" onClick={onConfirm} aria-label="Yes">
            ▶
          </button>
          <button className="circle-button red" onClick={onCancel} aria-label="No">
            ✖
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrateModal;
