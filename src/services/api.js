const API_URL = "http://localhost:3001";

export async function getPricing() {
  const response = await fetch(`${API_URL}/pricing`);
  if (!response.ok) {
    throw new Error("Failed to fetch pricing");
  }

  return response.json();
}

export async function submitOrder(payload) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to submit order");
  }

  return response.json();
}
