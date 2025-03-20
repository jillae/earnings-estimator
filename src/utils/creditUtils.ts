
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
  
  // VIKTIG FELSÖKNING: Logga alla ingående värden för att förstå när flatrate ska visas
  console.log(`shouldUseFlatrate kontroll för ${machine.name}:`, {
    leasingCost,
    treatmentsPerDay,
    leasingRate,
    machinePriceSEK,
    usesCredits: machine.usesCredits
  });
  
  // REGEL 1: Måste ha minst 3 behandlingar per dag
  if (treatmentsPerDay < 3) {
    console.log(`Flatrate nekad: Antal behandlingar per dag (${treatmentsPerDay}) < 3`);
    return false;
  }
  
  // REGEL 2: Leasingkostnad måste vara > 80% av leasingMax (eller flatrateThreshold om det finns)
  let flatrateThreshold: number;
  
  // Hämta dynamiskt beräknad flatrateThreshold om möjligt
  if (leasingRate !== undefined && machinePriceSEK !== undefined) {
    const leasingRateNum = typeof leasingRate === 'string' ? parseFloat(leasingRate) : leasingRate;
    const dynamicRange = calculateLeasingRange(machine, machinePriceSEK, leasingRateNum, false);
    
    if (dynamicRange.flatrateThreshold !== undefined) {
      flatrateThreshold = dynamicRange.flatrateThreshold;
      console.log(`Använder dynamiskt beräknad flatrateThreshold: ${flatrateThreshold}`);
    } else {
      // Om flatrateThreshold saknas, beräkna det som 80% av vägen från min till max
      flatrateThreshold = dynamicRange.min + (dynamicRange.max - dynamicRange.min) * 0.8;
      console.log(`Beräknad flatrateThreshold: ${flatrateThreshold} (80% mellan ${dynamicRange.min} och ${dynamicRange.max})`);
    }
  } 
  // Fallback: om vi inte kan beräkna dynamiskt, använd leasingMax * 0.8
  else if (machine.leasingMax !== undefined) {
    flatrateThreshold = machine.leasingMax * 0.8;
    console.log(`Använder 80% av leasingMax för flatrate-beslut: ${flatrateThreshold}`);
  } else {
    console.log(`Ingen flatrateThreshold tillgänglig för flatrate-beslut för ${machine.name}`);
    return false;
  }
  
  // Kontrollera om leasingCost är över tröskeln
  const isAboveThreshold = leasingCost >= flatrateThreshold;
  console.log(`Flatrate-beslut: leasingCost ${leasingCost} ${isAboveThreshold ? '>=' : '<'} tröskelvärde ${flatrateThreshold} OCH behandlingar ${treatmentsPerDay} >= 3`);
  
  // Returnera true bara om BÅDA villkoren uppfylls
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
