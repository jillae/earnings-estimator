
/**
 * Utility functions for handling exchange rates
 */
import { getExchangeRate } from './exchangeRate';
import { Machine } from '../data/machineData';

export async function fetchExchangeRate(): Promise<number> {
  try {
    const rate = await getExchangeRate('EUR', 'SEK');
    return rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 11.49260;
  }
}

export function calculateMachinePriceSEK(machine: Machine, exchangeRate: number): number {
  return machine.priceEur * exchangeRate;
}
