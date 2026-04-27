export function TrustBadges({ t }) {
  return (
    <div className="trust-badges">
      <div className="trust-badge">
        <div className="trust-badge-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <span>{t?.securePayment || "Secure Payment"}</span>
      </div>
      <div className="trust-badge">
        <div className="trust-badge-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <span>{t?.moneyBack || "Money Back Guarantee"}</span>
      </div>
      <div className="trust-badge">
        <div className="trust-badge-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <span>{t?.support || "24/7 Support"}</span>
      </div>
    </div>
  );
}

export default TrustBadges;
