/**
 * Utility functions for credit price calculations
 */
import { WORKING_DAYS_PER_MONTH } from './constants';
import { Machine } from '../data/machineData';
import { calculateLeasingRange } from './leasingUtils';

export function calculateCreditPrice(machine: Machine, leasingCost: number, leasingRate?: string | number, machinePriceSEK?: number): number {
  if (!machine.usesCredits) return 0;
  
  // Ensure we have defined credit min/max values
  if (machine.creditMin === undefined || machine.creditMax === undefined) {
    console.error("Machine credit min/max values are undefined");
    return 0;
  }
  
  console.log(`Starting credit price calculation for ${machine.name} with min: ${machine.creditMin}, max: ${machine.creditMax}`);
  
  // Use the machine's maximum credit price as default
  // This ensures we always start with the highest credit price value
  return machine.creditMax;
}

// Function to determine if flatrate should be used based on the rules
export function shouldUseFlatrate(
  machine: Machine,
  leasingCost: number,
  treatmentsPerDay: number,
  leasingRate?: string | number, 
  machinePriceSEK?: number
): boolean {
  if (!machine.usesCredits) {
    return false;
  }
  
  // Rule 1: Must have at least 3 treatments per day
  if (treatmentsPerDay < 3) {
    console.log(`Flatrate denied: Treatments per day (${treatmentsPerDay}) < 3`);
    return false;
  }
  
  // Rule 2: Leasing cost must be > 80% of leasingMax
  // Get leasingMax (prefer machine's defined value if available)
  let leasingMax: number;
  
  if (machine.leasingMax !== undefined) {
    leasingMax = machine.leasingMax;
    console.log(`Using hardcoded leasingMax for flatrate decision: ${leasingMax}`);
  }
  // Otherwise use dynamic calculation if possible
  else if (leasingRate !== undefined && machinePriceSEK !== undefined) {
    const leasingRateNum = typeof leasingRate === 'string' ? parseFloat(leasingRate) : leasingRate;
    const dynamicRange = calculateLeasingRange(machine, machinePriceSEK, leasingRateNum, false);
    leasingMax = dynamicRange.max;
    console.log(`Using dynamically calculated leasingMax for flatrate decision: ${leasingMax}`);
  } else {
    console.log(`No leasingMax available for flatrate decision for ${machine.name}`);
    return false;
  }
  
  // Calculate the threshold at 80% of leasingMax
  const flatrateThreshold = leasingMax * 0.8;
  
  // Check if leasingCost is above the 80% threshold
  const isAboveThreshold = leasingCost > flatrateThreshold;
  console.log(`Flatrate decision: leasingCost ${leasingCost} ${isAboveThreshold ? '>' : '<='} threshold ${flatrateThreshold} (80% of ${leasingMax}) AND treatments ${treatmentsPerDay} >= 3`);
  
  return isAboveThreshold;
}

export function calculateOperatingCost(
  machine: Machine,
  treatmentsPerDay: number,
  creditPrice: number,
  leasingCost: number,
  leasingRate?: string | number,
  machinePriceSEK?: number
): { costPerMonth: number; useFlatrate: boolean } {
  // Determine if flatrate should be used based on rules
  const useFlatrate = shouldUseFlatrate(machine, leasingCost, treatmentsPerDay, leasingRate, machinePriceSEK);
  
  let costPerMonth = 0;
  
  if (machine.usesCredits) {
    if (useFlatrate) {
      console.log(`Using flatrate amount for ${machine.name}: ${machine.flatrateAmount}`);
      costPerMonth = machine.flatrateAmount;
    } else {
      const creditsPerTreatment = 1;
      costPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH * creditsPerTreatment * creditPrice;
      console.log(`Calculated credit cost per month for ${machine.name}: ${costPerMonth} (${treatmentsPerDay} treatments/day × ${WORKING_DAYS_PER_MONTH} days/month × ${creditsPerTreatment} credits/treatment × ${creditPrice} SEK/credit)`);
    }
  }
  
  return { costPerMonth, useFlatrate };
}
