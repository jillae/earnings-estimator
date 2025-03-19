
/**
 * Utility functions for handling exchange rates
 */
import { getExchangeRate } from './exchangeRate';
import { Machine } from '../data/machineData';

export async function fetchExchangeRate(): Promise<number> {
  try {
    console.log("Fetching exchange rate from API...");
    const rate = await getExchangeRate('EUR', 'SEK');
    console.log("Fetched exchange rate:", rate);
    return rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    const fallbackRate = 11.4926;
    console.log("Using fallback exchange rate:", fallbackRate);
    return fallbackRate;
  }
}

export function calculateMachinePriceSEK(machine: Machine, exchangeRate: number): number {
  const priceSEK = machine.priceEur * exchangeRate;
  console.log(`Calculated price for ${machine.name}: ${machine.priceEur} EUR × ${exchangeRate} = ${priceSEK} SEK`);
  return priceSEK;
}
