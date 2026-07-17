const BASE_URL = "https://stock.indianapi.in"

export async function makeAPIRequest(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const response = await fetch(`${BASE_URL}${endpoint}?${new URLSearchParams(params)}`, {
    headers: {
      "x-api-key": process.env.INDIAN_STOCK_MARKET_API_KEY || "",
    }
  });
  console.error(`API request to ${BASE_URL}${endpoint} with params ${JSON.stringify(params)} returned status ${response.status}`);
  if (!response.ok) {
    console.error(`API request failed with status ${response.status}: ${response.statusText}`);
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
}