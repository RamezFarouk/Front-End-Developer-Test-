// Fallback mock data when json-server or WordPress API is unavailable
const mockPricing = [
  { id: "1", months: 3, sessionsPerMonth: 8, pricePerSession: 18 },
  { id: "2", months: 6, sessionsPerMonth: 10, pricePerSession: 16 },
  { id: "3", months: 12, sessionsPerMonth: 12, pricePerSession: 14 }
];

// Determine API URL based on environment/WordPress integration
const API_URL = typeof window !== 'undefined' && window.gostudentApiSettings 
  ? window.gostudentApiSettings.root 
  : "http://localhost:3001";

const getNonce = () => {
  return typeof window !== 'undefined' && window.gostudentApiSettings 
    ? window.gostudentApiSettings.nonce 
    : "";
};

export async function getPricing() {
  try {
    const headers = getNonce() ? { 'X-WP-Nonce': getNonce() } : {};
    // Add artificial delay for realistic UX in demo mode
    if (API_URL === "http://localhost:3001") {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    const response = await fetch(`${API_URL}/pricing`, { headers });
    
    if (!response.ok) {
      console.warn("Failed to fetch pricing, using fallback data.");
      return mockPricing;
    }
    return await response.json();
  } catch (error) {
    console.warn("API unreachable, using fallback data:", error);
    return mockPricing;
  }
}

export async function submitOrder(payload) {
  try {
    const headers = { "Content-Type": "application/json" };
    if (getNonce()) headers['X-WP-Nonce'] = getNonce();
    
    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to submit order");
    }

    return await response.json();
  } catch (error) {
    // If json-server is not running, simulate successful submit anyway for demo purposes
    if (API_URL === "http://localhost:3001") {
      console.warn("API unreachable, simulating success for demo.");
      return { ...payload, id: Math.random().toString(36).substr(2, 9), status: "success" };
    }
    throw error;
  }
}
