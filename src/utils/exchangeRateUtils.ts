
/**
 * @deprecated Use ExchangeRateEngine instead
 * Detta är en wrapper för bakåtkompatibilitet
 */

import { ExchangeRateEngine } from './core/ExchangeRateEngine';
import { Machine } from '../data/machines/types';

export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  return ExchangeRateEngine.getRate();
}

export async function calculateMachinePriceSEK(machine: Machine): Promise<number> {
  if (!machine || !machine.priceEur) {
    return 0;
  }
  
  try {
    const exchangeRate = await ExchangeRateEngine.getRate();
    return machine.priceEur * exchangeRate;
  } catch (error) {
    console.error('Error calculating machine price in SEK:', error);
    return await ExchangeRateEngine.convertEurToSek(machine.priceEur);
  }
}

// Alias för bakåtkompatibilitet
export const fetchExchangeRate = getExchangeRate;
