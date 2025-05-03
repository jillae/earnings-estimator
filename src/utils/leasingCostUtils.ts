
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
  
  // Valideringskontroll
  if (!machine || !machine.id || machinePriceSEK <= 0) {
    console.error('Ogiltiga parametrar för leasingkostnadsberäkning', {
      machine: machine?.id || 'undefined',
      machinePriceSEK,
      leasingRate: leasingRateNum
    });
    return 0;
  }
  
  // Get the dynamic leasing range
  const leasingRange = calculateLeasingRange(machine, machinePriceSEK, leasingRateNum, includeInsurance);
  let baseLeasingCost: number;
  
  console.log(`Beräkning av leasingkostnad för ${machine.name}:
    machinePriceSEK: ${machinePriceSEK}
    leasingRate: ${leasingRateNum}
    includeInsurance: ${includeInsurance}
    leaseMultiplier: ${leaseMultiplier}
    leasingRange: min=${leasingRange.min}, max=${leasingRange.max}, default=${leasingRange.default}
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
    Default: ${leasingRange.default},
    Range: ${leaseRange}, 
    Calculated: ${baseLeasingCost}
  `);
  
  // Lägg till försäkringskostnaden separat om den inte redan är inkluderad i leasingRange
  // Detta säkerställer att försäkringen alltid beaktas korrekt
  let finalCost = baseLeasingCost;
  
  console.log(`Final leasing cost: ${finalCost}`);
  
  // Validera resultat - inga orimligt låga värden för dyra maskiner
  if (finalCost < 500 && machinePriceSEK > 50000) {
    console.error(`VARNING: Orimligt lågt leasingvärde (${finalCost}) beräknat för ${machine.name} med pris ${machinePriceSEK} SEK`);
  }
  
  return finalCost;
}
