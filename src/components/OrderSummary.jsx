import TrustBadges from "./TrustBadges";

function OrderSummary({
  selectedPlan,
  durationMonths,
  sessionsPerMonth,
  pricePerSession,
  regularPrice,
  advanceDiscount,
  setupFee,
  payInAdvance,
  monthlyTotal,
  totalSessions,
  totalPrice,
  finalTotalPrice,
  locale,
  checkoutFormId = "checkout-form",
}) {
  const texts = {
    "en-GB": {
      title: "Order summary",
      subtitle: "Review your package before paying.",
      noPlan: "No plan selected.",
      duration: "Duration",
      months: "months",
      sessionsPerMonth: "Sessions per month",
      pricePerSession: "Price per session",
      monthlyTotal: "Monthly total",
      totalSessions: "Total sessions",
      regularPrice: "Regular price",
      yourPrice: "Your price",
      advanceDiscount: "Advance discount",
      setupFee: "Setup fee",
      finalTotalPrice: "Final total",
      pay: "Pay",
      securePayment: "Secure Payment",
      moneyBack: "14-Day Money Back",
      support: "24/7 Support"
    },
    "fr-FR": {
      title: "Récapitulatif",
      subtitle: "Vérifiez votre forfait avant paiement.",
      noPlan: "Aucun forfait sélectionné.",
      duration: "Durée",
      months: "mois",
      sessionsPerMonth: "Sessions par mois",
      pricePerSession: "Prix par session",
      monthlyTotal: "Total mensuel",
      totalSessions: "Total des sessions",
      regularPrice: "Prix standard",
      yourPrice: "Votre prix",
      advanceDiscount: "Remise anticipée",
      setupFee: "Frais d'inscription",
      finalTotalPrice: "Total final",
      pay: "Payer",
      securePayment: "Paiement Sécurisé",
      moneyBack: "Garantie 14 Jours",
      support: "Support 24/7"
    },
    "ar-SA": {
      title: "ملخص الطلب",
      subtitle: "راجع الباقة قبل الدفع.",
      noPlan: "لم يتم اختيار باقة.",
      duration: "المدة",
      months: "أشهر",
      sessionsPerMonth: "الجلسات شهريا",
      pricePerSession: "سعر الجلسة",
      monthlyTotal: "الإجمالي الشهري",
      totalSessions: "إجمالي الجلسات",
      regularPrice: "السعر الأساسي",
      yourPrice: "سعرك",
      advanceDiscount: "خصم الدفع المسبق",
      setupFee: "رسوم الإعداد",
      finalTotalPrice: "المجموع النهائي",
      pay: "ادفع",
      securePayment: "دفع آمن",
      moneyBack: "ضمان 14 يوم",
      support: "دعم 24/7"
    },
  };
  const t = texts[locale] ?? texts["en-GB"];

  if (!selectedPlan) {
    return (
      <aside className="card card--summary">
        <h2 className="card__title">{t.title}</h2>
        <p>{t.noPlan}</p>
      </aside>
    );
  }

  return (
    <aside className="card card--summary">
      <h2 className="card__title">{t.title}</h2>
      <p className="card__subtitle">{t.subtitle}</p>

      <div className="summary-list">
        <div className="summary-row">
          <span>{t.duration}</span>
          <strong>{durationMonths} {t.months}</strong>
        </div>
        <div className="summary-row">
          <span>{t.sessionsPerMonth}</span>
          <strong>{sessionsPerMonth}</strong>
        </div>
        <div className="summary-row">
          <span>{t.pricePerSession}</span>
          <strong>${pricePerSession}</strong>
        </div>
        
        <div className="summary-divider"></div>
        
        <div className="summary-row">
          <span>{t.monthlyTotal}</span>
          <strong>${monthlyTotal.toFixed(2)}</strong>
        </div>
        <div className="summary-row">
          <span>{t.totalSessions}</span>
          <strong>{totalSessions}</strong>
        </div>
        
        <div className="summary-divider"></div>
        
        <div className="summary-row">
          <span>{t.regularPrice}</span>
          <strong className="price-strike">${regularPrice.toFixed(2)}</strong>
        </div>
        <div className="summary-row">
          <span>{t.yourPrice}</span>
          <strong>${totalPrice.toFixed(2)}</strong>
        </div>
        
        {payInAdvance && (
          <div className="summary-row">
            <span>{t.advanceDiscount} (5%)</span>
            <strong className="price-discount">-${advanceDiscount.toFixed(2)}</strong>
          </div>
        )}
        
        <div className="summary-row">
          <span>{t.setupFee}</span>
          <strong>${setupFee.toFixed(2)}</strong>
        </div>
      </div>

      <div className="summary-total">
        <span>{t.finalTotalPrice}</span>
        <strong>${finalTotalPrice.toFixed(2)}</strong>
      </div>

      <button type="submit" form={checkoutFormId} className="btn-primary summary-submit-btn">
        {t.pay} ${finalTotalPrice.toFixed(2)}
      </button>
      
      <TrustBadges t={t} />
    </aside>
  );
}

export default OrderSummary;
