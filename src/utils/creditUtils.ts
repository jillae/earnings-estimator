
/**
 * Utility functions for credit price calculations
 */
import { WORKING_DAYS_PER_MONTH } from './constants';
import { Machine } from '../data/machineData';
import { calculateLeasingRange } from './leasingUtils';

export function calculateCreditPrice(machine: Machine, leasingCost: number, leasingRate?: number | string, machinePriceSEK?: number): number {
  if (!machine.usesCredits) return 0;
  
  // Ensure leasingRate is a number if provided
  const leasingRateNum = leasingRate !== undefined && typeof leasingRate === 'string' 
    ? parseFloat(leasingRate) 
    : leasingRate;
  
  // If we have dynamic leasingMax calculation available, use it
  let creditMin = machine.creditMin;
  let creditMax = machine.creditMax;
  let leasingMin: number;
  let leasingMax: number;
  
  // Calculate dynamic leasing range if we have all necessary parameters
  if (leasingRateNum !== undefined && machinePriceSEK !== undefined) {
    const dynamicRange = calculateLeasingRange(machine, machinePriceSEK, leasingRateNum, false);
    leasingMin = dynamicRange.min;
    leasingMax = dynamicRange.max;
    console.log(`Using dynamically calculated leasing range: ${leasingMin} - ${leasingMax}`);
  } else if (machine.creditMin !== undefined && machine.creditMax !== undefined) {
    // Fall back to the hardcoded values as a last resort
    leasingMin = machine.leasingMin !== undefined ? machine.leasingMin : 0;
    leasingMax = machine.leasingMax !== undefined ? machine.leasingMax : 0;
    console.log(`Using fallback leasing range: ${leasingMin} - ${leasingMax}`);
  } else {
    // If no ranges are available, use the inverse formula
    const calculatedCredit = Math.round((1 / leasingCost) * machine.creditPriceMultiplier * 1000000);
    console.log(`Fallback calculated credit price for ${machine.name}: ${calculatedCredit}`);
    return calculatedCredit;
  }
  
  const leasingRange = leasingMax - leasingMin;
  if (leasingRange <= 0) {
    console.log(`Zero leasing range for ${machine.name}, using credit min: ${creditMin}`);
    return creditMin !== undefined ? creditMin : 0;
  }
  
  const leasingPosition = Math.max(0, Math.min(1, (leasingCost - leasingMin) / leasingRange));
  
  const inversePosition = 1 - leasingPosition;
  
  const creditRange = (creditMax !== undefined && creditMin !== undefined) ? 
                      creditMax - creditMin : 0;
  
  let calculatedCredit;
  
  // Ensure correct credit price mapping:
  // At minimum leasing cost we want maximum credit price
  // At maximum leasing cost we want minimum credit price
  if (leasingCost <= leasingMin) {
    calculatedCredit = creditMax;
    console.log(`Using maximum credit price ${creditMax} at minimum leasing cost ${leasingMin}`);
  } 
  else if (leasingCost >= leasingMax) {
    calculatedCredit = creditMin;
    console.log(`Using minimum credit price ${creditMin} at maximum leasing cost ${leasingMax}`);
  } 
  else {
    calculatedCredit = Math.round((creditMin !== undefined && creditMax !== undefined) ? 
                      (creditMin + inversePosition * creditRange) : 0);
    console.log(`Interpolated credit price: ${calculatedCredit} at leasing position ${leasingPosition}`);
  }
  
  console.log(`Calculated credit price for ${machine.name}:`, {
    leasingCost,
    leasingMin,
    leasingMax,
    leasingRange,
    leasingPosition,
    inversePosition,
    creditMin,
    creditMax,
    creditRange,
    calculatedCredit
  });
  
  return calculatedCredit;
}

// Function to determine if flatrate should be used based on the rules
export function shouldUseFlatrate(
  machine: Machine,
  leasingCost: number,
  treatmentsPerDay: number,
  leasingRate?: number | string, 
  machinePriceSEK?: number
): boolean {
  if (!machine.usesCredits) {
    return false;
  }
  
  // Ensure leasingRate is a number if provided
  const leasingRateNum = leasingRate !== undefined && typeof leasingRate === 'string' 
    ? parseFloat(leasingRate) 
    : leasingRate;
  
  // Get dynamic leasingMax if possible
  let leasingMax: number;
  
  if (leasingRateNum !== undefined && machinePriceSEK !== undefined) {
    const dynamicRange = calculateLeasingRange(machine, machinePriceSEK, leasingRateNum, false);
    leasingMax = dynamicRange.max;
    console.log(`Using dynamically calculated leasingMax for flatrate decision: ${leasingMax}`);
  } else if (machine.leasingMax !== undefined) {
    leasingMax = machine.leasingMax;
    console.log(`Using hardcoded leasingMax for flatrate decision: ${leasingMax}`);
  } else {
    console.log(`No leasingMax available for flatrate decision for ${machine.name}`);
    return false;
  }
  
  // Rule: If leasingCost > 80% of leasingMax AND treatmentsPerDay >= 3, use flatrate
  const flatrateThreshold = leasingMax * 0.8;
  console.log(`Flatrate decision: leasingCost ${leasingCost} ${leasingCost > flatrateThreshold ? '>' : '<='} threshold ${flatrateThreshold} (80% of ${leasingMax}) AND treatments ${treatmentsPerDay} ${treatmentsPerDay >= 3 ? '>=' : '<'} 3`);
  
  return leasingCost > flatrateThreshold && treatmentsPerDay >= 3;
}

export function calculateOperatingCost(
  machine: Machine,
  treatmentsPerDay: number,
  creditPrice: number,
  leasingCost: number,
  leasingRate?: number | string,
  machinePriceSEK?: number
): { costPerMonth: number; useFlatrate: boolean } {
  // Ensure leasingRate is a number if provided
  const leasingRateNum = leasingRate !== undefined && typeof leasingRate === 'string' 
    ? parseFloat(leasingRate) 
    : leasingRate;
  
  // Determine if flatrate should be used based on rules
  const useFlatrate = shouldUseFlatrate(machine, leasingCost, treatmentsPerDay, leasingRateNum, machinePriceSEK);
  
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
