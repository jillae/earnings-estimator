/**
 * STRATEGISK LEASING KONSTANTER
 * 
 * Centraliserad hantering av strategiska leasingpriser för att undvika hårdkodning
 */

import { Machine } from './machines/types';

/**
 * Strategiska leasingkostnader per maskin
 * Dessa värden inkluderar credit-kompensation och representerar "strategipaket"-priset
 */
export const STRATEGIC_LEASING_COSTS = {
  // Premium maskiner
  emerald: 33863,  // Emerald Laser System - inkluderar full credit-kompensation
  zerona: 17043,   // Z6 Laser System - inkluderar full credit-kompensation
  
  // Treatment maskiner  
  'fx-635': 13893, // FX-635 - inkluderar full credit-kompensation
  'fx-405': 16673, // FX-405 - inkluderar full credit-kompensation
  
  // Handheld maskiner (använder inte credits, så samma som grundkostnad)
  xlr8: 0,     // Beräknas från leasingtariffer
  evrl: 0,     // Beräknas från leasingtariffer
  gvl: 0,      // Beräknas från leasingtariffer
  
  // Special maskiner
  'base-station': 0, // Använder inte credits
  lunula: 0          // Använder inte credits
} as const;

/**
 * Hämta strategisk leasingkostnad för en maskin
 * @param machine - Maskinen att hämta strategisk kostnad för
 * @returns Strategisk leasingkostnad eller undefined om maskinen inte stöds
 */
export function getStrategicLeasingCost(machine: Machine): number | undefined {
  // Först kolla om maskinen har leasingMax definierat (föredras)
  if (machine.leasingMax && machine.leasingMax > 0) {
    return machine.leasingMax;
  }
  
  // Fallback till konstant-tabellen
  return STRATEGIC_LEASING_COSTS[machine.id as keyof typeof STRATEGIC_LEASING_COSTS] || undefined;
}

/**
 * Kontrollera om en maskin stöder strategisk leasing
 * @param machine - Maskinen att kontrollera
 * @returns True om maskinen stöder strategisk leasing
 */
export function supportsStrategicLeasing(machine: Machine): boolean {
  return machine.usesCredits && (machine.leasingMax !== undefined || getStrategicLeasingCost(machine) !== undefined);
}

/**
 * Beräkna credit-kompensation för en maskin
 * @param machine - Maskinen
 * @param baseLeasingCost - Grundleasingkostnad
 * @returns Credit-kompensation i SEK/månad
 */
export function calculateCreditCompensation(machine: Machine, baseLeasingCost: number): number {
  if (!machine.usesCredits) {
    return 0;
  }
  
  const strategicCost = getStrategicLeasingCost(machine);
  if (!strategicCost) {
    return 0;
  }
  
  return Math.max(0, strategicCost - baseLeasingCost);
}

/**
 * Validera strategiska leasingvärden
 */
export function validateStrategicLeasingData(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Kontrollera att alla credit-maskiner har strategiska kostnader
  Object.entries(STRATEGIC_LEASING_COSTS).forEach(([machineId, cost]) => {
    if (cost <= 0) {
      warnings.push(`${machineId}: Strategisk kostnad är 0 eller negativ`);
    }
  });
  
  // Kontrollera rimliga prisintervall
  if (STRATEGIC_LEASING_COSTS.emerald < 30000 || STRATEGIC_LEASING_COSTS.emerald > 40000) {
    warnings.push(`Emerald strategisk kostnad (${STRATEGIC_LEASING_COSTS.emerald}) ligger utanför förväntat intervall (30000-40000)`);
  }
  
  if (STRATEGIC_LEASING_COSTS.zerona < 15000 || STRATEGIC_LEASING_COSTS.zerona > 20000) {
    warnings.push(`Zerona strategisk kostnad (${STRATEGIC_LEASING_COSTS.zerona}) ligger utanför förväntat intervall (15000-20000)`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Dokumentation för strategiska leasingpriser
 */
export const STRATEGIC_LEASING_DOCUMENTATION = {
  purpose: 'Strategisk leasing inkluderar all credit-kostnad i månadspriset för förutsägbar budgetering',
  calculation: 'Grundkostnad + estimerad credit-kostnad baserat på förväntad användning',
  benefits: [
    'Förutsägbar månadskostnad',
    'Ingen risk för överraskande credit-kostnader',
    'Enklare budgetering',
    'Idealisk för höga behandlingsvolymer'
  ],
  limitations: [
    'Högre månadsavgift',
    'Mindre flexibilitet vid låg användning',
    'Valet låses vid köp'
  ]
};

export default {
  STRATEGIC_LEASING_COSTS,
  getStrategicLeasingCost,
  supportsStrategicLeasing,
  calculateCreditCompensation,
  validateStrategicLeasingData,
  STRATEGIC_LEASING_DOCUMENTATION
};