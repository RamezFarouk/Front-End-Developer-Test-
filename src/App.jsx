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

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        setLoading(true);
        setApiError("");
        const pricingData = await getPricing();
        setPricing(pricingData);
        if (pricingData.length) {
          setSelectedPlanId(pricingData[0].id);
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
          />
          <OrderSummary pricing={pricing} selectedPlanId={selectedPlanId} />
        </main>
      )}
    </div>
  );
}

export default App;
