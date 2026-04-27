export function LoadingSkeleton() {
  return (
    <div className="layout-grid" aria-hidden="true">
      <div className="card">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text" style={{ width: "40%" }}></div>
        <div className="plan-cards" style={{ marginTop: "1.5rem" }}>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
        </div>
        <div className="form-grid" style={{ marginTop: "2rem" }}>
          <div className="skeleton skeleton-input"></div>
          <div className="skeleton skeleton-input"></div>
          <div className="skeleton skeleton-input"></div>
          <div className="skeleton skeleton-input"></div>
        </div>
      </div>
      <div className="card card--summary">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-input" style={{ marginTop: "2rem" }}></div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
