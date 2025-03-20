
/**
 * Utility functions for credit price calculations
 */
import { WORKING_DAYS_PER_MONTH } from './constants';
import { Machine } from '../data/machineData';
import { calculateLeasingRange } from './leasingUtils';

export function calculateCreditPrice(
  machine: Machine, 
  leasingCost: number,
  leasingRate?: string | number, 
  machinePriceSEK?: number
): number {
  if (!machine.usesCredits) return 0;
  
  // Ensure we have defined credit min/max values
  if (machine.creditMin === undefined || machine.creditMax === undefined) {
    console.error("Machine credit min/max values are undefined");
    return 0;
  }
  
  console.log(`Starting credit price calculation for ${machine.name} with min: ${machine.creditMin}, max: ${machine.creditMax}`);
  
  // Get the leasing range to calculate the position within the range
  let leasingMin: number, leasingMax: number;
  
  if (machine.leasingMin !== undefined && machine.leasingMax !== undefined) {
    leasingMin = machine.leasingMin;
    leasingMax = machine.leasingMax;
  } else if (leasingRate !== undefined && machinePriceSEK !== undefined) {
    const leasingRateNum = typeof leasingRate === 'string' ? parseFloat(leasingRate) : leasingRate;
    const dynamicRange = calculateLeasingRange(machine, machinePriceSEK, leasingRateNum, false);
    leasingMin = dynamicRange.min;
    leasingMax = dynamicRange.max;
  } else {
    console.error("Unable to determine leasing range for credit price calculation");
    return machine.creditMax; // Return maximum credit price as fallback
  }
  
  // Calculate normalized position within the leasing range
  const leasingPosition = Math.max(0, Math.min(1, (leasingCost - leasingMin) / (leasingMax - leasingMin)));
  
  // Inverse mapping: when leasing cost is high, credit price should be lower
  const inverseLeasingPosition = 1 - leasingPosition;
  
  // Calculate credit price based on position (linear interpolation)
  const creditPrice = machine.creditMin + inverseLeasingPosition * (machine.creditMax - machine.creditMin);
  
  console.log(`Credit price calculation: 
    Leasing cost: ${leasingCost} 
    Leasing range: ${leasingMin} - ${leasingMax}
    Leasing position: ${leasingPosition}
    Inverse position: ${inverseLeasingPosition}
    Credit range: ${machine.creditMin} - ${machine.creditMax}
    Calculated credit price: ${creditPrice}
  `);
  
  // Return the calculated credit price, ensuring it's within the valid range
  return Math.max(machine.creditMin, Math.min(machine.creditMax, creditPrice));
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
  
  // VIKTIG ÄNDRING: Kontrollera BÅDE behandlingar per dag OCH leasingkostnad
  // Regel 1: Måste ha minst 3 behandlingar per dag
  if (treatmentsPerDay < 3) {
    console.log(`Flatrate nekad: Antal behandlingar per dag (${treatmentsPerDay}) < 3`);
    return false;
  }
  
  // Regel 2: Leasingkostnad måste vara > 80% av leasingMax
  // Hämta leasingMax (föredra maskinens definierade värde om tillgängligt)
  let leasingMax: number;
  
  if (machine.leasingMax !== undefined) {
    leasingMax = machine.leasingMax;
    console.log(`Använder hårdkodad leasingMax för flatrate-beslut: ${leasingMax}`);
  }
  // Annars använd dynamisk beräkning om möjligt
  else if (leasingRate !== undefined && machinePriceSEK !== undefined) {
    const leasingRateNum = typeof leasingRate === 'string' ? parseFloat(leasingRate) : leasingRate;
    const dynamicRange = calculateLeasingRange(machine, machinePriceSEK, leasingRateNum, false);
    leasingMax = dynamicRange.max;
    console.log(`Använder dynamiskt beräknad leasingMax för flatrate-beslut: ${leasingMax}`);
  } else {
    console.log(`Ingen leasingMax tillgänglig för flatrate-beslut för ${machine.name}`);
    return false;
  }
  
  // Beräkna tröskelvärdet vid 80% av leasingMax
  const flatrateThreshold = leasingMax * 0.8;
  
  // Kontrollera om leasingCost är över 80%-tröskeln
  const isAboveThreshold = leasingCost >= flatrateThreshold;
  console.log(`Flatrate-beslut: leasingCost ${leasingCost} ${isAboveThreshold ? '>=' : '<'} tröskelvärde ${flatrateThreshold} (80% av ${leasingMax}) OCH behandlingar ${treatmentsPerDay} >= 3`);
  
  // VIKTIG ÄNDRING: Returnera bara true om BÅDA villkoren uppfylls
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
  // Avgör om flatrate ska användas baserat på reglerna
  const useFlatrate = shouldUseFlatrate(machine, leasingCost, treatmentsPerDay, leasingRate, machinePriceSEK);
  
  let costPerMonth = 0;
  
  if (machine.usesCredits) {
    if (useFlatrate) {
      console.log(`Använder flatrate-belopp för ${machine.name}: ${machine.flatrateAmount}`);
      costPerMonth = machine.flatrateAmount;
    } else {
      const creditsPerTreatment = 1;
      costPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH * creditsPerTreatment * creditPrice;
      console.log(`Beräknad creditkostnad per månad för ${machine.name}: ${costPerMonth} (${treatmentsPerDay} behandlingar/dag × ${WORKING_DAYS_PER_MONTH} dagar/månad × ${creditsPerTreatment} credits/behandling × ${creditPrice} SEK/credit)`);
    }
  }
  
  return { costPerMonth, useFlatrate };
}
