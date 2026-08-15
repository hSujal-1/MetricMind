const API_BASE_URL = "http://127.0.0.1:8000";

async function askDashboardQuestion(question: string) {
  const response = await fetch(`${API_BASE_URL}/api/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Dashboard API request failed: ${response.status}`
    );
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      data.error ||
      data.message ||
      "Unable to retrieve dashboard data."
    );
  }

  return data;
}


// =========================================================
// TOTAL SALES
// =========================================================

export async function getTotalSales() {
  return askDashboardQuestion(
    "What are the total sales?"
  );
}


// =========================================================
// TOTAL PROFIT
// =========================================================

export async function getTotalProfit() {
  return askDashboardQuestion(
    "What is the total profit?"
  );
}


// =========================================================
// SALES BY REGION
// =========================================================

export async function getSalesByRegion() {
  return askDashboardQuestion(
    "What are the sales by region?"
  );
}


// =========================================================
// SALES BY CATEGORY
// =========================================================

export async function getSalesByCategory() {
  return askDashboardQuestion(
    "What are the sales by category?"
  );
}


// =========================================================
// TOP 10 CITIES
// =========================================================

export async function getTopCities() {
  return askDashboardQuestion(
    "What are the top 10 cities by sales?"
  );
}


// =========================================================
// SALES TREND
// =========================================================

export async function getSalesTrend() {
  return askDashboardQuestion(
    "What are the sales by year?"
  );
}