
/**
 * Utility functions for handling insurance calculations
 */
import { insuranceRates } from '@/data/machines/leasingOptions';

/**
 * Calculates the monthly insurance cost based on machine price
 * 
 * @param machinePriceSEK - The machine price in SEK
 * @returns The monthly insurance cost
 */
export function calculateInsuranceCost(machinePriceSEK: number): number {
  if (!machinePriceSEK || isNaN(machinePriceSEK)) {
    return 0;
  }
  
  // Försäkringssats baserat på maskinpris
  let insuranceRate: number;
  
  if (machinePriceSEK <= 10000) {
    insuranceRate = insuranceRates[10000];
  } else if (machinePriceSEK <= 20000) {
    insuranceRate = insuranceRates[20000];
  } else if (machinePriceSEK <= 50000) {
    insuranceRate = insuranceRates[50000];
  } else {
    insuranceRate = insuranceRates[Infinity];
  }
  
  // Beräkna månadskostnad (årskostnad / 12)
  const monthlyCost = Math.round(machinePriceSEK * insuranceRate / 12);
  console.log(`Beräknad försäkringskostnad: ${monthlyCost} SEK/månad (Maskinpris: ${machinePriceSEK} SEK, Sats: ${insuranceRate})`);
  return monthlyCost;
}

/**
 * Checks if insurance option is enabled
 * 
 * @param selectedInsuranceId - The selected insurance option ID
 * @returns Boolean indicating if insurance is enabled
 */
export function isInsuranceEnabled(selectedInsuranceId: string): boolean {
  return selectedInsuranceId === 'yes';
}
