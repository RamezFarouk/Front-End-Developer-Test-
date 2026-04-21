import { useMemo } from "react";

export function usePricing(pricing, selectedPlanId) {
  return useMemo(() => {
    const selectedPlan =
      pricing.find((plan) => plan.id === Number(selectedPlanId)) || pricing[0];

    if (!selectedPlan) {
      return {
        selectedPlan: null,
        monthlyPrice: 0,
        totalSessions: 0,
        totalPrice: 0,
      };
    }

    const monthlyPrice = selectedPlan.sessionsPerMonth * selectedPlan.pricePerSession;
    const totalSessions = selectedPlan.months * selectedPlan.sessionsPerMonth;
    const totalPrice = selectedPlan.months * monthlyPrice;

    return {
      selectedPlan,
      monthlyPrice,
      totalSessions,
      totalPrice,
    };
  }, [pricing, selectedPlanId]);
}
