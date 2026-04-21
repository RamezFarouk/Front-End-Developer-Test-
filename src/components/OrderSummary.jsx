function OrderSummary({
  selectedPlan,
  durationMonths,
  sessionsPerMonth,
  pricePerSession,
  monthlyTotal,
  totalSessions,
  totalPrice,
}) {
  if (!selectedPlan) {
    return (
      <aside className="card card--summary">
        <h2>Order summary</h2>
        <p>No plan selected.</p>
      </aside>
    );
  }

  return (
    <aside className="card card--summary">
      <h2>Order summary</h2>
      <p className="card__subtitle">Review your package before paying.</p>

      <div className="summary-list">
        <div className="summary-row">
          <span>Duration</span>
          <strong>{durationMonths} months</strong>
        </div>
        <div className="summary-row">
          <span>Sessions per month</span>
          <strong>{sessionsPerMonth}</strong>
        </div>
        <div className="summary-row">
          <span>Price per session</span>
          <strong>${pricePerSession}</strong>
        </div>
        <div className="summary-row">
          <span>Monthly total</span>
          <strong>${monthlyTotal}</strong>
        </div>
        <div className="summary-row">
          <span>Total sessions</span>
          <strong>{totalSessions}</strong>
        </div>
      </div>

      <div className="summary-total">
        <span>Total price</span>
        <strong>${totalPrice}</strong>
      </div>
    </aside>
  );
}

export default OrderSummary;
