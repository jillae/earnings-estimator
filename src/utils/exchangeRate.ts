
export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  const localStorageKey = `exchangeRate_${fromCurrency}_${toCurrency}`;
  const storedRate = localStorage.getItem(localStorageKey);

  if (storedRate) {
    return parseFloat(storedRate);
  }

  try {
    // Add a delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // The Riksbank API has a specific format requirement
    // For EUR to SEK, we need SEKEURPMI to SEKSEKPMI
    const response = await fetch(
      `https://api.riksbank.se/swea/v1/CrossRates/${toCurrency}${fromCurrency}PMI/${toCurrency}${toCurrency}PMI`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      console.warn(`API responded with status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.groups || !data.groups[0] || !data.groups[0].series || !data.groups[0].series[0] || !data.groups[0].series[0].value) {
      console.warn("Unexpected API response format:", data);
      throw new Error('Invalid API response format');
    }
    
    const exchangeRate = data.groups[0].series[0].value[0];
    console.log("Successfully retrieved exchange rate:", exchangeRate);

    // Cache the rate in localStorage
    localStorage.setItem(localStorageKey, exchangeRate.toString());
    return exchangeRate;
  } catch (error) {
    console.error('Failed to fetch exchange rate from Riksbanken:', error);

    // Provide a reasonable fallback value
    const fallbackRate = 11.4926; // EUR to SEK hardcoded fallback
    console.log("Using fallback exchange rate:", fallbackRate);
    return fallbackRate;
  }
}
