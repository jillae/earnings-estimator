
/**
 * Utility functions for calculating leasing costs
 */
import { Machine } from '../data/machineData';
import { calculateLeasingRange } from './leasingRangeUtils';
import { INSURANCE_RATES } from './constants';
import { roundToHundredEndingSix } from './formatUtils';

/**
 * Calculates the leasing cost based on machine, price, leasing rate, etc.
 */
export function calculateLeasingCost(
  machine: Machine,
  machinePriceSEK: number,
  leasingRate: number | string,
  includeInsurance: boolean,
  leaseMultiplier: number
): number {
  // Ensure leasingRate is a number
  const leasingRateNum = typeof leasingRate === 'string' ? parseFloat(leasingRate) : leasingRate || 0;
  
  // Get the dynamic leasing range
  const leasingRange = calculateLeasingRange(machine, machinePriceSEK, leasingRateNum, false);
  let baseLeasingCost: number;
  
  // Använd linjär interpolation mellan min och max baserat på leaseMultiplier
  // leaseMultiplier ska vara mellan 0 och 1, där:
  // - 0 representerar leasingRange.min
  // - 1 representerar leasingRange.max
  const leaseRange = leasingRange.max - leasingRange.min;
  baseLeasingCost = leasingRange.min + (leaseMultiplier * leaseRange);
  
  // Avrunda till närmaste 100-tal slutande på 6
  baseLeasingCost = roundToHundredEndingSix(baseLeasingCost);
  
  console.log(`Interpolated leasing cost for ${machine.name} at factor ${leaseMultiplier}: 
    Min: ${leasingRange.min}, 
    Max: ${leasingRange.max}, 
    Range: ${leaseRange}, 
    Calculated: ${baseLeasingCost}
  `);
  
  let insuranceCost = 0;
  if (includeInsurance) {
    insuranceCost = calculateInsuranceCost(machinePriceSEK);
    console.log(`Adding insurance cost: ${insuranceCost}`);
  }
  
  const finalCost = baseLeasingCost + insuranceCost;
  console.log(`Final leasing cost: ${finalCost}`);
  return finalCost;
}

/**
 * Helper function to calculate insurance cost
 */
function calculateInsuranceCost(machinePriceSEK: number): number {
  let insuranceRate = INSURANCE_RATES.RATE_ABOVE_50K;
  
  if (machinePriceSEK <= 10000) {
    insuranceRate = INSURANCE_RATES.RATE_10K_OR_LESS;
  } else if (machinePriceSEK <= 20000) {
    insuranceRate = INSURANCE_RATES.RATE_20K_OR_LESS;
  } else if (machinePriceSEK <= 50000) {
    insuranceRate = INSURANCE_RATES.RATE_50K_OR_LESS;
  }
  
  return machinePriceSEK * insuranceRate / 12;
}
