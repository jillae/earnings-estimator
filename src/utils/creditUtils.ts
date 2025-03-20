
/**
 * Utility functions for credit price calculations
 */
import { WORKING_DAYS_PER_MONTH, CREDIT_PRICE_MULTIPLIERS } from './constants';
import { Machine } from '../data/machineData';
import { calculateLeasingRange } from './leasingUtils';

export function calculateCreditPrice(
  machine: Machine, 
  leasingCost: number,
  leasingRate?: string | number, 
  machinePriceSEK?: number
): number {
  if (!machine.usesCredits) return 0;
  
  // Använd direkt de konstanta värdena från Admin-sidan
  // Välj rätt multiplikator baserat på maskintyp genom att kontrollera ID
  // Premium maskiner är: emerald och zerona
  const isPremiumMachine = ['emerald', 'zerona'].includes(machine.id);
  const multiplier = isPremiumMachine 
    ? CREDIT_PRICE_MULTIPLIERS.PREMIUM 
    : CREDIT_PRICE_MULTIPLIERS.STANDARD;
    
  // Beräkna kreditpris baserat på maskinpris och konstant multiplikator
  if (machinePriceSEK) {
    const creditPrice = machinePriceSEK * multiplier;
    
    console.log(`Credit price calculation (using fixed multiplier): 
      Machine Price SEK: ${machinePriceSEK}
      Multiplier: ${multiplier}
      Calculated credit price: ${creditPrice}
    `);
    
    return creditPrice;
  }
  
  // Om maskinpris saknas, returna 0
  console.error("Machine price in SEK is required for credit price calculation");
  return 0;
}

// Beräkna vid vilket antal behandlingar per dag som flatrate blir mer kostnadseffektivt än styckepris
export function calculateFlatrateBreakEven(
  flatrateAmount: number,
  creditPrice: number
): number {
  if (flatrateAmount <= 0 || creditPrice <= 0) {
    return 0; // Undvik division med noll
  }
  
  // Beräkna hur många credits som behövs per månad för att flatrate ska bli mer kostnadseffektivt
  const breakevenCredits = flatrateAmount / creditPrice;
  
  // Beräkna motsvarande antal behandlingar per dag (en behandling = 1 credit)
  const breakEvenTreatmentsPerDay = breakevenCredits / WORKING_DAYS_PER_MONTH;
  
  // Avrunda uppåt till närmaste heltal
  return Math.ceil(breakEvenTreatmentsPerDay);
}

// Function to determine if flatrate should be used based on the rules
export function shouldUseFlatrate(
  machine: Machine,
  leasingCost: number,
  treatmentsPerDay: number,
  allowBelowFlatrate: boolean = true,
  leasingRate?: string | number, 
  machinePriceSEK?: number
): boolean {
  if (!machine.usesCredits) {
    return false;
  }
  
  // Om användaren har valt att inte aktivera flatrate, returnera false direkt
  if (allowBelowFlatrate) {
    console.log(`Flatrate nekad: Användaren har inaktiverat flatrate (allowBelowFlatrate: ${allowBelowFlatrate})`);
    return false;
  }
  
  // VIKTIG FELSÖKNING: Logga alla ingående värden för att förstå när flatrate ska visas
  console.log(`shouldUseFlatrate kontroll för ${machine.name}:`, {
    leasingCost,
    treatmentsPerDay,
    leasingRate,
    machinePriceSEK,
    usesCredits: machine.usesCredits,
    allowBelowFlatrate
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
  allowBelowFlatrate: boolean = true,
  leasingRate?: string | number,
  machinePriceSEK?: number
): { costPerMonth: number; useFlatrate: boolean } {
  // Avgör om flatrate ska användas baserat på reglerna
  const useFlatrate = shouldUseFlatrate(machine, leasingCost, treatmentsPerDay, allowBelowFlatrate, leasingRate, machinePriceSEK);
  
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
