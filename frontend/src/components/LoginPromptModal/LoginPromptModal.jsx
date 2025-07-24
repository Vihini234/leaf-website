import './LoginPromptModal.css';

function LoginPromptModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <h3>🔒 Please Login First</h3>
        <p>You need to log in to access this feature.</p>
        <button className="modal-close" onClick={onClose}>Okay</button>
      </div>
    </div>
  );
}

export default LoginPromptModal;