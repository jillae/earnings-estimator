
import { Machine } from '../data/machines/types';
import { WORKING_DAYS_PER_MONTH } from './constants';

// Beräkna antalet behandlingar per månad baserat på antalet behandlingar per dag
export function calculateTreatmentsPerMonth(treatmentsPerDay: number): number {
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
  if (!machine.usesCredits) return 0;
  
  // Använd maskinens fördefinierade creditMin värde istället för att beräkna
  if (machine.creditMin !== undefined) {
    console.log(`Använder fördefinierat creditMin för ${machine.name}: ${machine.creditMin}`);
    return machine.creditMin;
  }
  
  // Beräkna kreditpris baserat på maskinpris (om sådant finns) som fallback
  if (machinePriceSEK) {
    // En konstant multiplikator för alla maskiner
    // Detta är ett standardvärde som kan justeras
    const baseCreditFactor = 0.002;
    return Math.round(machinePriceSEK * baseCreditFactor);
  }
  
  // Fallback om ingen av ovanstående fungerar
  return machine.creditPriceMultiplier || 0;
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
  usePerCreditModel: boolean = true,
  selectedLeasingPeriodId?: string,
  machinePriceSEK?: number
): { costPerMonth: number, useFlatrate: boolean } {
  // Om maskinen inte använder credits, är driftkostnaden 0
  if (!machine.usesCredits) {
    return { costPerMonth: 0, useFlatrate: false };
  }
  
  // Flagga för att avgöra om flatrate ska användas
  let useFlatrate = !usePerCreditModel;
  
  let costPerMonth = 0;
  
  // Om flatrate används, använd det fasta beloppet
  if (useFlatrate) {
    costPerMonth = machine.flatrateAmount || 0;
  } else {
    // Annars beräkna baserat på krediter
    const creditsPerTreatment = machine.creditsPerTreatment || 1;
    const treatmentsPerMonth = calculateTreatmentsPerMonth(treatmentsPerDay);
    costPerMonth = creditsPerTreatment * treatmentsPerMonth * creditPrice;
  }
  
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
  if (!machine.usesCredits || !machine.flatrateAmount) {
    return false;
  }
  
  // Leasingkostnad måste vara minst 80% av max för att kvalificera för flatrate
  const leasingPercent = machine.leasingMax > 0 ? leasingCost / machine.leasingMax : 0;
  
  // Minst 3 behandlingar per dag krävs för flatrate
  const minTreatments = treatmentsPerDay >= 3;
  
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
  if (creditPrice <= 0 || flatrateAmount <= 0) return 0;
  
  // Beräkna hur många behandlingar som krävs för att flatrate ska löna sig
  // Formel: flatrateAmount / (creditPrice * creditsPerTreatment * workingDaysPerMonth)
  const breakEvenTreatmentsPerMonth = flatrateAmount / (creditPrice * creditsPerTreatment);
  const breakEvenTreatmentsPerDay = Math.ceil(breakEvenTreatmentsPerMonth / WORKING_DAYS_PER_MONTH);
  
  return breakEvenTreatmentsPerDay;
}
