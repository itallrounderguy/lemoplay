// src/components/LogoutModal.jsx
import './LogoutModal.css';

const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal">
        <iframe
          src="https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/lemo_front/lemo_front.html?animation=wavehello&scale=1"
          width="200"
          height="120"
          className="logo-iframe"
          title="Lemo Logo"
          allowTransparency="true"
        ></iframe>

        <p>Are you sure you want to log out?</p>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>Yes, Log Out</button>
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
