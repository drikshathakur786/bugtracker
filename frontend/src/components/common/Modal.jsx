import styles from './Modal.module.css';

// Reusable modal wrapper — we'll use this for bug creation too
function Modal({ title, onClose, children }) {
  return (
    // Clicking the backdrop closes the modal
    <div className={styles.backdrop} onClick={onClose}>
      {/* Stop click from reaching backdrop when clicking inside modal */}
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;