import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import CheckoutForm from "./components/CheckoutForm";
import OrderSummary from "./components/OrderSummary";
import { getPricing } from "./services/api";
import "./styles/app.css";

function App() {
  const [pricing, setPricing] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [direction, setDirection] = useState("ltr");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [payInAdvance, setPayInAdvance] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState("en-GB");

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
      eyebrow: "Order your learning plan",
      title: "Build your personalized tutoring package",
      switchDir: direction === "ltr" ? "Switch to RTL" : "Switch to LTR",
      loading: "Loading pricing plans...",
      apiError: "Could not load pricing plans. Please retry.",
    },
    "fr-FR": {
      eyebrow: "Commandez votre plan d'apprentissage",
      title: "Créez votre forfait de tutorat personnalisé",
      switchDir: direction === "ltr" ? "Passer en RTL" : "Passer en LTR",
      loading: "Chargement des offres...",
      apiError: "Impossible de charger les offres. Veuillez réessayer.",
    },
    "ar-SA": {
      eyebrow: "اطلب خطة التعلم الخاصة بك",
      title: "أنشئ باقة التدريس المخصصة لك",
      switchDir: direction === "ltr" ? "التحويل إلى RTL" : "التحويل إلى LTR",
      loading: "جار تحميل الباقات...",
      apiError: "تعذر تحميل الباقات. يرجى المحاولة مرة أخرى.",
    },
  };
  const t = i18n[selectedLocale] ?? i18n["en-GB"];

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

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
          setSelectedPlanId(Number(normalizedPricing[0].id));
        }
      } catch (error) {
        setApiError("pricing-load-failed");
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, []);

  return (
    <div className="page" dir={direction}>
      <header className="page__header">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
        </div>
        <button
          type="button"
          className="dir-toggle"
          onClick={() =>
            setDirection((currentDirection) =>
              currentDirection === "ltr" ? "rtl" : "ltr"
            )
          }
        >
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
              <ReactCountryFlag countryCode={language.code} svg />
              <span>{language.label}</span>
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="state">{t.loading}</div>
      ) : apiError ? (
        <div className="state state--error">{t.apiError}</div>
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
          />
        </main>
      )}
    </div>
  );
}

export default App;
