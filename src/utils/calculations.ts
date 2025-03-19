
import { getExchangeRate } from './exchangeRate';
import { Machine } from '../data/machineData';
import { calculateLeasingRange } from './leasingUtils';

export async function calculateLeasingCost(
  machine: Machine,
  leasingPeriod: number,
  includeInsurance: boolean
): Promise<number> {
  const machinePrice = machine.priceEur;
  const currency = 'EUR'; // Maskinpriser är i EUR från machineData
  let exchangeRate = 1;

  // Använd string-jämförelse istället för literal types
  if (currency as string !== 'SEK') {
    try {
      exchangeRate = await getExchangeRate(currency, 'SEK');
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      exchangeRate = 11.4926; // Fallback to default
    }
  }

  const machinePriceSek = machinePrice * exchangeRate;

  // Get the leasing range using the dynamically calculated values
  const leasingRange = calculateLeasingRange(
    machine,
    machinePriceSek,
    leasingPeriod / 100, // Convert to decimal format
    includeInsurance
  );

  // Use the default value from the range calculation
  return leasingRange.default;
}
