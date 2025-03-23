
import { Machine } from '../data/machines/types';
import { WORKING_DAYS_PER_MONTH } from './constants';

// Beräkna antalet behandlingar per månad baserat på antalet behandlingar per dag
export function calculateTreatmentsPerMonth(treatmentsPerDay: number): number {
  if (isNaN(treatmentsPerDay) || treatmentsPerDay === null || treatmentsPerDay === undefined) {
    return 0;
  }
  return treatmentsPerDay * WORKING_DAYS_PER_MONTH;
}

/**
 * Beräknar och returnerar priset per credit baserat på maskintyp och leasingkostnad
 */
export function calculateCreditPrice(
  machine: Machine, 
  leasingCost: number,
  selectedLeasingPeriodId?: string,
  machinePriceSEK?: number
): number {
  if (!machine || !machine.usesCredits) return 0;
  
  console.log(`Beräknar kreditpris för ${machine.name}:
    - leasingCost: ${leasingCost}
    - machine.leasingMin: ${machine.leasingMin}
    - machine.leasingMax: ${machine.leasingMax}
    - machine.creditMin: ${machine.creditMin}
    - machine.creditMax: ${machine.creditMax}
  `);
  
  // Om vi har leasingMin, leasingMax, creditMin, creditMax - beräkna dynamiskt baserat på leasingCost
  if (machine.leasingMin !== undefined && machine.leasingMax !== undefined &&
      machine.creditMin !== undefined && machine.creditMax !== undefined && 
      leasingCost !== undefined) {
      
    // Beräkna var i spannet mellan min och max leasing vi befinner oss (0-1)
    const leasingRange = machine.leasingMax - machine.leasingMin;
    const position = leasingRange > 0 ? 
      Math.max(0, Math.min(1, (leasingCost - machine.leasingMin) / leasingRange)) : 0;
    
    // Interpolera kreditpriset baserat på position
    const creditRange = machine.creditMax - machine.creditMin;
    const calculatedCreditPrice = machine.creditMin + (position * creditRange);
    
    console.log(`Dynamiskt beräknat kreditpris för ${machine.name}: 
      Position ${position.toFixed(2)} i spannet ger ${Math.round(calculatedCreditPrice)} kr/credit`);
    
    return Math.round(calculatedCreditPrice);
  }
  
  // Fallback till det ursprungliga sättet
  // Använd maskinens fördefinierade creditMin värde om det finns
  if (machine.creditMin !== undefined) {
    console.log(`Använder fördefinierat credit-värde för ${machine.name}: ${machine.creditMin}`);
    return machine.creditMin;
  }
  
  // Säkerställ att leasingCost är ett giltigt värde
  const safeLeasingCost = isNaN(leasingCost) ? 0 : leasingCost;
  
  // Om ingen creditMin, beräkna baserat på leasingkostnad och prismultiplikator
  if (machine.creditPriceMultiplier && safeLeasingCost > 0) {
    const calculatedPrice = Math.round(safeLeasingCost * machine.creditPriceMultiplier);
    console.log(`Beräknat kreditpris baserat på multiplikator (${machine.creditPriceMultiplier}) och leasingkostnad (${safeLeasingCost}): ${calculatedPrice}`);
    return calculatedPrice;
  }
  
  // Beräkna kreditpris baserat på maskinpris (om sådant finns) som fallback
  if (machinePriceSEK && !isNaN(machinePriceSEK)) {
    // En konstant multiplikator för alla maskiner
    const baseCreditFactor = 0.002;
    const calculatedPrice = Math.round(machinePriceSEK * baseCreditFactor);
    console.log(`Beräknat kreditpris baserat på maskinpris (${machinePriceSEK}): ${calculatedPrice}`);
    return calculatedPrice;
  }
  
  // Fallback om ingen av ovanstående fungerar
  console.log(`Använder standardvärde 149 för credits för ${machine.name}`);
  return 149; // Standardvärde för credits
}

/**
 * Beräknar driftkostnaden (per månad) baserat på maskintyp,
 * antal behandlingar per dag, och kreditpris
 */
export function calculateOperatingCost(
  machine: Machine,
  treatmentsPerDay: number,
  creditPrice: number,
  leasingCost: number = 0,
  useFlatrate: boolean = false,
  selectedLeasingPeriodId?: string,
  machinePriceSEK?: number
): { costPerMonth: number, useFlatrate: boolean } {
  // Om maskinen inte finns eller inte använder credits, är driftkostnaden 0
  if (!machine || !machine.usesCredits) {
    return { costPerMonth: 0, useFlatrate: false };
  }
  
  // Säkerställ att behandlingar per dag är ett positivt tal
  const safetreatmentsPerDay = Math.max(0, isNaN(treatmentsPerDay) ? 0 : treatmentsPerDay);
  
  // Säkerställ att kreditpriset är giltigt
  const safeCreditPrice = Math.max(0, isNaN(creditPrice) ? 0 : creditPrice);
  
  let costPerMonth = 0;
  
  // Om flatrate används, använd det fasta beloppet
  if (useFlatrate) {
    costPerMonth = machine.flatrateAmount || 0;
    console.log(`Flatrate används för ${machine.name}: ${costPerMonth} kr/månad`);
  } else {
    // Annars beräkna baserat på krediter
    const creditsPerTreatment = machine.creditsPerTreatment || 1;
    const treatmentsPerMonth = calculateTreatmentsPerMonth(safetreatmentsPerDay);
    costPerMonth = creditsPerTreatment * treatmentsPerMonth * safeCreditPrice;
    console.log(`Per-credit modell används för ${machine.name}: 
      ${creditsPerTreatment} credits/beh * ${treatmentsPerMonth} beh/mån * ${safeCreditPrice} kr/credit = ${costPerMonth} kr/mån`);
  }
  
  console.log(`Beräknad driftkostnad:
    Maskin: ${machine.name}
    Behandlingar/dag: ${safetreatmentsPerDay}
    Kreditpris: ${safeCreditPrice}
    Använder flatrate: ${useFlatrate}
    Kostnad/månad: ${costPerMonth}
  `);
  
  return { costPerMonth, useFlatrate };
}

/**
 * Avgör om flatrate ska användas baserat på regler
 */
export function shouldUseFlatrate(
  machine: Machine,
  leasingCost: number,
  treatmentsPerDay: number,
  allowBelowFlatrate: boolean,
  selectedLeasingPeriodId?: string,
  machinePriceSEK?: number
): boolean {
  if (!machine || !machine.usesCredits || !machine.flatrateAmount) {
    return false;
  }
  
  // Säkerställ att leasingCost är giltigt
  const safeLeasingCost = Math.max(0, isNaN(leasingCost) ? 0 : leasingCost);
  const safetreatmentsPerDay = isNaN(treatmentsPerDay) ? 0 : treatmentsPerDay;
  
  // Leasingkostnad måste vara minst 80% av max för att kvalificera för flatrate
  const leasingPercent = machine.leasingMax > 0 ? safeLeasingCost / machine.leasingMax : 0;
  
  // Minst 3 behandlingar per dag krävs för flatrate
  const minTreatments = safetreatmentsPerDay >= 3;
  
  // Om allowBelowFlatrate är false, måste vi vara över tröskelvärdet
  // för att aktivera flatrate
  const meetsLeasingRequirement = allowBelowFlatrate || leasingPercent >= 0.8;
  
  // Båda kraven måste vara uppfyllda
  return meetsLeasingRequirement && minTreatments;
}

/**
 * Beräknar det antal behandlingar per dag där flatrate blir mer kostnadseffektivt
 * än att betala per credit
 */
export function calculateFlatrateBreakEven(
  flatrateAmount: number,
  creditPrice: number,
  creditsPerTreatment: number = 1
): number {
  // Säkerställ att vi inte delar med noll och hanterar ogiltiga värden
  if (isNaN(flatrateAmount) || isNaN(creditPrice) || flatrateAmount <= 0 || creditPrice <= 0) {
    return 0;
  }
  
  // Beräkna hur många behandlingar som krävs för att flatrate ska löna sig
  // Formel: flatrateAmount / (creditPrice * creditsPerTreatment * workingDaysPerMonth)
  const breakEvenTreatmentsPerMonth = flatrateAmount / (creditPrice * creditsPerTreatment);
  const breakEvenTreatmentsPerDay = Math.ceil(breakEvenTreatmentsPerMonth / WORKING_DAYS_PER_MONTH);
  
  return breakEvenTreatmentsPerDay;
}
