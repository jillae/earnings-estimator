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
    const response = await fetch(
      `https://api.riksbank.se/swea/v1/CrossRates/SEK${fromCurrency.toUpperCase()}PMI/SEK${toCurrency.toUpperCase()}PMI`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const exchangeRate = data.groups[0].series[0].value[0];

    localStorage.setItem(localStorageKey, exchangeRate);
    return exchangeRate;
  } catch (error) {
    console.error('Failed to fetch exchange rate from Riksbanken:', error);

    // Fallback to a hardcoded value or another source
    // For example, you could use another API or a default value
    const fallbackRate = 11.4926; // Replace with your fallback source
    return fallbackRate;
  }
}
