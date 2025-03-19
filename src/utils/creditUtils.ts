
/**
 * Utility functions for credit price calculations
 */
import { WORKING_DAYS_PER_MONTH, FLATRATE_THRESHOLD } from './constants';
import { Machine } from '../data/machineData';

export function calculateCreditPrice(machine: any, leasingCost: number): number {
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
    
    // Flip the logic here to match the business requirements:
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

export function calculateOperatingCost(
  machine: any,
  treatmentsPerDay: number,
  creditPrice: number,
  forceUseFlatrate: boolean = false
): { costPerMonth: number; useFlatrate: boolean } {
  const useFlatrate = forceUseFlatrate && machine.usesCredits && treatmentsPerDay >= FLATRATE_THRESHOLD;
  
  let costPerMonth = 0;
  
  if (machine.usesCredits) {
    if (useFlatrate) {
      costPerMonth = machine.flatrateAmount;
    } else {
      const creditsPerTreatment = 1;
      costPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH * creditsPerTreatment * creditPrice;
    }
  }
  
  return { costPerMonth, useFlatrate };
}
