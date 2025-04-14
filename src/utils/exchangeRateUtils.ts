
import { DEFAULT_EXCHANGE_RATE } from './constants';
import { Machine } from '../data/machines/types';

export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    // Simulerar API-anrop (ersätter axios för tillfället)
    console.log(`Hämtar växelkurs från ${fromCurrency} till ${toCurrency}`);
    // Returnerar standard-växelkursen om vi inte kan använda axios
    return DEFAULT_EXCHANGE_RATE;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return DEFAULT_EXCHANGE_RATE;
  }
}

export async function calculateMachinePriceSEK(machine: Machine): Promise<number> {
  if (!machine || !machine.priceEur) {
    return 0;
  }
  
  try {
    const exchangeRate = await getExchangeRate('EUR', 'SEK');
    return machine.priceEur * exchangeRate;
  } catch (error) {
    console.error('Error calculating machine price in SEK:', error);
    return machine.priceEur * DEFAULT_EXCHANGE_RATE;
  }
}

// Alias för bakåtkompatibilitet
export const fetchExchangeRate = getExchangeRate;
