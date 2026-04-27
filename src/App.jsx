import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import CheckoutForm from "./components/CheckoutForm";
import OrderSummary from "./components/OrderSummary";
import LoadingSkeleton from "./components/LoadingSkeleton";
import SuccessModal from "./components/SuccessModal";
import { getPricing } from "./services/api";
import "./styles/app.css";

function App() {
  const checkoutFormId = "checkout-form";
  const [pricing, setPricing] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [direction, setDirection] = useState("ltr");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [payInAdvance, setPayInAdvance] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState("en-GB");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const selectedPlan =
    pricing.find((plan) => Number(plan.id) === Number(selectedPlanId)) ?? null;

  const durationMonths =
    selectedPlan?.durationMonths ?? selectedPlan?.months ?? 0;
  const sessionsPerMonth = selectedPlan?.sessionsPerMonth ?? 0;
  const pricePerSession = selectedPlan?.pricePerSession ?? 0;

  const monthlyTotal = pricePerSession * sessionsPerMonth;
  const totalPrice = monthlyTotal * durationMonths;
  const totalSessions = sessionsPerMonth * durationMonths;
  const advanceDiscount = payInAdvance ? totalPrice * 0.05 : 0;
  const finalTotalPrice = totalPrice - advanceDiscount;
  const regularPrice = totalPrice;
  const setupFee = 0;

  const languageOptions = [
    { code: "GB", label: "EN", value: "en-GB" },
    { code: "SA", label: "AR", value: "ar-SA" },
    { code: "FR", label: "FR", value: "fr-FR" },
  ];

  const i18n = {
    "en-GB": {
      eyebrow: "Step 2 of 3: Payment",
      title: "Complete your order",
      switchDir: direction === "ltr" ? "Switch to RTL" : "Switch to LTR",
      loading: "Loading pricing plans...",
      apiError: "Could not load pricing plans. Using default fallback plans.",
      successTitle: "Order Successful!",
      successMessage: "Thank you for your purchase. We will contact you shortly.",
      close: "Close"
    },
    "fr-FR": {
      eyebrow: "Étape 2 sur 3 : Paiement",
      title: "Finalisez votre commande",
      switchDir: direction === "ltr" ? "Passer en RTL" : "Passer en LTR",
      loading: "Chargement des offres...",
      apiError: "Impossible de charger les offres. Utilisation des forfaits par défaut.",
      successTitle: "Commande réussie !",
      successMessage: "Merci pour votre achat. Nous vous contacterons sous peu.",
      close: "Fermer"
    },
    "ar-SA": {
      eyebrow: "الخطوة 2 من 3: الدفع",
      title: "أكمل طلبك",
      switchDir: direction === "ltr" ? "التحويل إلى RTL" : "التحويل إلى LTR",
      loading: "جار تحميل الباقات...",
      apiError: "تعذر تحميل الباقات. يتم استخدام الباقات الافتراضية.",
      successTitle: "تم الطلب بنجاح!",
      successMessage: "شكراً لشرائك. سنتواصل معك قريباً.",
      close: "إغلاق"
    },
  };
  const t = i18n[selectedLocale] ?? i18n["en-GB"];

  useEffect(() => {
    document.documentElement.dir = direction;
    // SEO Meta Tags
    document.title = t.title + " | GoStudent";
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = t.eyebrow + " - " + t.title;
  }, [direction, t.title, t.eyebrow]);

  useEffect(() => {
    document.documentElement.lang = selectedLocale;
    if (selectedLocale === "ar-SA") {
      setDirection("rtl");
    } else {
      setDirection("ltr");
    }
  }, [selectedLocale]);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        setLoading(true);
        setApiError("");
        const pricingData = await getPricing();
        const normalizedPricing = pricingData.map((plan) => ({
          ...plan,
          id: Number(plan.id),
          durationMonths: plan.durationMonths ?? plan.months,
        }));

        setPricing(normalizedPricing);
        if (normalizedPricing.length) {
          // Select middle plan (6 months) as default if available, otherwise first
          const defaultPlan = normalizedPricing.find(p => p.durationMonths === 6) || normalizedPricing[0];
          setSelectedPlanId(Number(defaultPlan.id));
        }
      } catch (error) {
        setApiError(t.apiError);
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, [t.apiError]);

  return (
    <div className="page" dir={direction}>
      <header className="page__header">
        <div>
          <div className="eyebrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            {t.eyebrow}
          </div>
          <h1>{t.title}</h1>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="dir-toggle"
            onClick={() =>
              setDirection((currentDirection) =>
                currentDirection === "ltr" ? "rtl" : "ltr"
              )
            }
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3"></path><path d="M21 12L17 8"></path><path d="M21 12L17 16"></path></svg>
            {t.switchDir}
          </button>
          <div className="language-switcher" role="group" aria-label="Language selector">
            {languageOptions.map((language) => (
              <button
                key={language.value}
                type="button"
                className={`language-pill ${selectedLocale === language.value ? "language-pill--active" : ""}`}
                onClick={() => setSelectedLocale(language.value)}
              >
                <ReactCountryFlag countryCode={language.code} svg style={{ width: '1em', height: '1em' }} />
                <span>{language.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {apiError && (
        <div className="state state--error" style={{ marginBottom: "1rem" }}>
          ⚠ {apiError}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <main className="layout-grid">
          <CheckoutForm
            pricing={pricing}
            selectedPlanId={selectedPlanId}
            onSelectPlan={setSelectedPlanId}
            selectedPlan={selectedPlan}
            payInAdvance={payInAdvance}
            onTogglePayInAdvance={setPayInAdvance}
            finalTotalPrice={finalTotalPrice}
            locale={selectedLocale}
            onSuccess={() => setIsSuccessModalOpen(true)}
            formId={checkoutFormId}
          />
          <OrderSummary
            selectedPlan={selectedPlan}
            durationMonths={durationMonths}
            sessionsPerMonth={sessionsPerMonth}
            pricePerSession={pricePerSession}
            monthlyTotal={monthlyTotal}
            totalSessions={totalSessions}
            totalPrice={totalPrice}
            regularPrice={regularPrice}
            setupFee={setupFee}
            advanceDiscount={advanceDiscount}
            payInAdvance={payInAdvance}
            finalTotalPrice={finalTotalPrice}
            locale={selectedLocale}
            checkoutFormId={checkoutFormId}
          />
        </main>
      )}

      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        t={t}
      />
    </div>
  );
}

export default App;
