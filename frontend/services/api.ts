const API_BASE_URL = "http://172.20.10.9:8000";

export async function askMetricMind(question: string) {
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
    throw new Error("Failed to fetch response");
  }

  return response.json();
}