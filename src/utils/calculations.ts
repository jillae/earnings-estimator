
import { getExchangeRate } from './exchangeRateUtils';
import { Machine } from '../data/machines/types';
import { calculateLeasingRange } from './leasingRangeUtils';
import { calculateTariffBasedLeasingMax } from './leasingTariffUtils';

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

  // För att garantera korrekt beräkning, använd funktionen som är specificerad för tariffer
  const leasingCost = calculateTariffBasedLeasingMax(
    machine.priceEur,
    leasingPeriod, // Använd direkt leasingPeriod (månader, inte tariff)
    machine.usesCredits,
    exchangeRate
  );

  return leasingCost;
}
