export function SuccessModal({ isOpen, onClose, t }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2>{t?.successTitle || "Order Successful!"}</h2>
        <p className="card__subtitle" style={{ marginTop: "0.5rem" }}>
          {t?.successMessage || "Thank you for your purchase. We will contact you shortly."}
        </p>
        <button className="btn-primary" onClick={onClose} style={{ marginTop: "1.5rem", width: "100%" }}>
          {t?.close || "Close"}
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
