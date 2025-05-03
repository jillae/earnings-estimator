
/**
 * Utility functions for calculating leasing costs
 */
import { Machine } from '../data/machines/types';
import { calculateLeasingRange } from './leasingRangeUtils';
import { calculateInsuranceCost, isInsuranceEnabled } from './insuranceUtils';
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
  
  console.log(`Beräkning av leasingkostnad för ${machine.name}:
    machinePriceSEK: ${machinePriceSEK}
    leasingRate: ${leasingRateNum}
    includeInsurance: ${includeInsurance}
    leaseMultiplier: ${leaseMultiplier}
    leasingRange: min=${leasingRange.min}, max=${leasingRange.max}
  `);
  
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
  
  // Beräkna försäkringskostnaden separat
  let insuranceCost = 0;
  if (includeInsurance) {
    insuranceCost = calculateInsuranceCost(machinePriceSEK);
    console.log(`Adding insurance cost: ${insuranceCost} (for machine price: ${machinePriceSEK})`);
  } else {
    console.log("Försäkring inkluderas inte i beräkningen");
  }
  
  const finalCost = baseLeasingCost + insuranceCost;
  console.log(`Final leasing cost: ${finalCost} (Base: ${baseLeasingCost}, Insurance: ${insuranceCost})`);
  return finalCost;
}
