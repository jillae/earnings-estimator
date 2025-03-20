
/**
 * Utility functions for credit calculations
 */
import { VAT_RATE, FLATRATE_THRESHOLD, WORKING_DAYS_PER_MONTH } from './constants';

/**
 * Calculate the credit price based on machine price and multiplier
 */
export function calculateCreditPrice(machinePriceWithExchangeRate: number, creditPriceMultiplier: number): number {
  return machinePriceWithExchangeRate * creditPriceMultiplier;
}

/**
 * Calculate monthly operating cost for credits
 */
export function calculateOperatingCost(
  treatmentsPerDay: number,
  workingDaysPerMonth: number,
  creditPrice: number,
  flatrateAmount: number,
  useFlatrate: boolean
): number {
  // If we're using flatrate, return the flatrate amount
  if (useFlatrate) {
    return flatrateAmount;
  }
  
  // Calculate the number of credits needed per month
  const creditsPerTreatment = 1;
  const creditsPerMonth = treatmentsPerDay * workingDaysPerMonth * creditsPerTreatment;
  
  // Calculate the total monthly cost for credits
  return creditsPerMonth * creditPrice;
}

/**
 * Determine if flatrate should be used based on leasing cost and treatments
 */
export function shouldUseFlatrate(
  leasingCost: number, 
  flatrateThreshold: number,
  treatmentsPerDay: number
): boolean {
  // Only offer flatrate if leasing cost is above the threshold AND treatments per day is at least 3
  return leasingCost >= flatrateThreshold && treatmentsPerDay >= 3;
}
