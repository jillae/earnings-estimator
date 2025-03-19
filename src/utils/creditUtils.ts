
/**
 * Utility functions for credit price calculations
 */
import { WORKING_DAYS_PER_MONTH } from './constants';
import { Machine } from '../data/machineData';

export function calculateCreditPrice(machine: Machine, leasingCost: number): number {
  if (!machine.usesCredits) return 0;
  
  if (machine.creditMin !== undefined && machine.creditMax !== undefined && 
      machine.leasingMin !== undefined && machine.leasingMax !== undefined) {
    
    const leasingRange = machine.leasingMax - machine.leasingMin;
    if (leasingRange <= 0) {
      console.log(`Zero leasing range for ${machine.name}, using credit min: ${machine.creditMin}`);
      return machine.creditMin;
    }
    
    const leasingPosition = Math.max(0, Math.min(1, (leasingCost - machine.leasingMin) / leasingRange));
    
    const inversePosition = 1 - leasingPosition;
    
    const creditRange = machine.creditMax - machine.creditMin;
    
    let calculatedCredit;
    
    // Ensure correct credit price mapping:
    // At minimum leasing cost we want maximum credit price
    // At maximum leasing cost we want minimum credit price
    if (leasingCost <= machine.leasingMin) {
      calculatedCredit = machine.creditMax;
      console.log(`Using maximum credit price ${machine.creditMax} at minimum leasing cost ${machine.leasingMin}`);
    } 
    else if (leasingCost >= machine.leasingMax) {
      calculatedCredit = machine.creditMin;
      console.log(`Using minimum credit price ${machine.creditMin} at maximum leasing cost ${machine.leasingMax}`);
    } 
    else {
      calculatedCredit = Math.round(machine.creditMin + inversePosition * creditRange);
      console.log(`Interpolated credit price: ${calculatedCredit} at leasing position ${leasingPosition}`);
    }
    
    console.log(`Calculated credit price for ${machine.name}:`, {
      leasingCost,
      leasingMin: machine.leasingMin,
      leasingMax: machine.leasingMax,
      leasingRange,
      leasingPosition,
      inversePosition,
      creditMin: machine.creditMin,
      creditMax: machine.creditMax,
      creditRange,
      calculatedCredit
    });
    
    return calculatedCredit;
  }
  
  const calculatedCredit = Math.round((1 / leasingCost) * machine.creditPriceMultiplier * 1000000);
  console.log(`Fallback calculated credit price for ${machine.name}: ${calculatedCredit}`);
  return calculatedCredit;
}

// Function to determine if flatrate should be used based on the rules
export function shouldUseFlatrate(
  machine: Machine,
  leasingCost: number,
  treatmentsPerDay: number
): boolean {
  if (!machine.usesCredits) {
    return false;
  }
  
  // Rule: If leasingCost > 80% of leasingMax AND treatmentsPerDay >= 3, use flatrate
  if (machine.leasingMax) {
    const flatrateThreshold = machine.leasingMax * 0.8;
    console.log(`Flatrate decision: leasingCost ${leasingCost} ${leasingCost > flatrateThreshold ? '>' : '<='} threshold ${flatrateThreshold} (80% of ${machine.leasingMax}) AND treatments ${treatmentsPerDay} ${treatmentsPerDay >= 3 ? '>=' : '<'} 3`);
    
    return leasingCost > flatrateThreshold && treatmentsPerDay >= 3;
  }
  
  return false;
}

export function calculateOperatingCost(
  machine: Machine,
  treatmentsPerDay: number,
  creditPrice: number,
  leasingCost: number
): { costPerMonth: number; useFlatrate: boolean } {
  // Determine if flatrate should be used based on rules
  const useFlatrate = shouldUseFlatrate(machine, leasingCost, treatmentsPerDay);
  
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
