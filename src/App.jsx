import { useEffect, useState } from "react";
import CheckoutForm from "./components/Form";
import OrderSummary from "./components/OrderSummary";
import { getPricing } from "./services/api";
import "./styles/app.css";

function App() {
  const [pricing, setPricing] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [direction, setDirection] = useState("ltr");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const selectedPlan =
    pricing.find((plan) => Number(plan.id) === Number(selectedPlanId)) ?? null;

  const durationMonths =
    selectedPlan?.durationMonths ?? selectedPlan?.months ?? 0;
  const sessionsPerMonth = selectedPlan?.sessionsPerMonth ?? 0;
  const pricePerSession = selectedPlan?.pricePerSession ?? 0;

  const monthlyTotal = pricePerSession * sessionsPerMonth;
  const totalPrice = monthlyTotal * durationMonths;
  const totalSessions = sessionsPerMonth * durationMonths;

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

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
        setApiError("Could not load pricing plans. Please retry.");
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
          <p className="eyebrow">Order your learning plan</p>
          <h1>Build your personalized tutoring package</h1>
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
          {direction === "ltr" ? "Switch to RTL" : "Switch to LTR"}
        </button>
      </header>

      {loading ? (
        <div className="state">Loading pricing plans...</div>
      ) : apiError ? (
        <div className="state state--error">{apiError}</div>
      ) : (
        <main className="layout-grid">
          <CheckoutForm
            pricing={pricing}
            selectedPlanId={selectedPlanId}
            onSelectPlan={setSelectedPlanId}
            selectedPlan={selectedPlan}
            totalPrice={totalPrice}
          />
          <OrderSummary
            selectedPlan={selectedPlan}
            durationMonths={durationMonths}
            sessionsPerMonth={sessionsPerMonth}
            pricePerSession={pricePerSession}
            monthlyTotal={monthlyTotal}
            totalSessions={totalSessions}
            totalPrice={totalPrice}
          />
        </main>
      )}
    </div>
  );
}

export default App;
