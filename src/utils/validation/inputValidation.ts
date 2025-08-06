/**
 * ROBUST INPUT/OUTPUT VALIDERING
 * 
 * Säkerställer att alla finansiella data och användarinput är korrekta
 */

import { Machine } from '@/data/machines/types';
import { SliderStep } from '@/utils/sliderSteps';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationContext {
  machine?: Machine;
  treatmentsPerDay?: number;
  customerPrice?: number;
  currentSliderStep?: SliderStep;
  paymentOption?: 'leasing' | 'cash';
  selectedLeasingModel?: 'grundleasing' | 'strategisk';
}

/**
 * Validerar maskindata
 */
export function validateMachine(machine: Machine): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!machine.id || machine.id.trim() === '') {
    errors.push('Maskin saknar giltigt ID');
  }

  if (!machine.name || machine.name.trim() === '') {
    errors.push('Maskin saknar namn');
  }

  if (machine.priceEur === undefined || machine.priceEur <= 0) {
    errors.push('Maskin saknar giltigt EUR-pris');
  }

  if (machine.usesCredits) {
    if (!machine.creditMin || machine.creditMin <= 0) {
      errors.push('Credit-maskin saknar giltigt creditMin');
    }
    
    if (!machine.creditMax || machine.creditMax <= 0) {
      errors.push('Credit-maskin saknar giltigt creditMax');
    }
    
    if (machine.creditMin && machine.creditMax && machine.creditMin >= machine.creditMax) {
      errors.push('creditMin måste vara mindre än creditMax');
    }
    
    if (!machine.leasingMin || machine.leasingMin <= 0) {
      errors.push('Credit-maskin saknar giltigt leasingMin');
    }
    
    if (!machine.leasingMax || machine.leasingMax <= 0) {
      errors.push('Credit-maskin saknar giltigt leasingMax (strategisk kostnad)');
    }
    
    if (machine.leasingMin && machine.leasingMax && machine.leasingMin >= machine.leasingMax) {
      errors.push('leasingMin måste vara mindre än leasingMax');
    }
    
    if (!machine.flatrateAmount || machine.flatrateAmount <= 0) {
      warnings.push('Credit-maskin saknar flatrate-belopp');
    }
    
    if (!machine.creditsPerTreatment || machine.creditsPerTreatment <= 0) {
      errors.push('Credit-maskin saknar antal credits per behandling');
    }
  }

  if (!machine.leasingTariffs || Object.keys(machine.leasingTariffs).length === 0) {
    errors.push('Maskin saknar leasingtariffer');
  } else {
    // Validera att tarifferna är positiva nummer
    Object.entries(machine.leasingTariffs).forEach(([period, rate]) => {
      if (rate <= 0 || rate > 1) {
        errors.push(`Ogiltig leasingtariff för ${period} månader: ${rate}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validerar användarinput
 */
export function validateUserInput(context: ValidationContext): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validera behandlingar per dag
  if (context.treatmentsPerDay !== undefined) {
    if (context.treatmentsPerDay < 0) {
      errors.push('Behandlingar per dag kan inte vara negativt');
    } else if (context.treatmentsPerDay > 200) {
      warnings.push('Mycket hög behandlingsvolym (>200/dag) - kontrollera att detta är korrekt');
    } else if (context.treatmentsPerDay === 0) {
      warnings.push('Noll behandlingar per dag kommer resultera i noll intäkter');
    }
  }

  // Validera kundpris
  if (context.customerPrice !== undefined) {
    if (context.customerPrice < 0) {
      errors.push('Kundpris kan inte vara negativt');
    } else if (context.customerPrice < 100) {
      warnings.push('Mycket lågt kundpris (<100 kr) - kontrollera att detta är korrekt');
    } else if (context.customerPrice > 10000) {
      warnings.push('Mycket högt kundpris (>10000 kr) - kontrollera att detta är korrekt');
    }
  }

  // Validera slider-steg
  if (context.currentSliderStep !== undefined) {
    const validSteps = [0, 0.5, 1, 1.5, 2];
    if (!validSteps.includes(context.currentSliderStep)) {
      errors.push(`Ogiltigt slider-steg: ${context.currentSliderStep}. Tillåtna värden: ${validSteps.join(', ')}`);
    }
  }

  // Validera leasingmodell-kombination
  if (context.machine?.usesCredits && context.selectedLeasingModel === 'strategisk') {
    if (!context.machine.leasingMax || context.machine.leasingMax <= 0) {
      errors.push('Strategisk leasing kräver giltigt leasingMax-värde i maskindata');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validerar beräkningsresultat
 */
export function validateCalculationResults(results: any, context: ValidationContext): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validera att grundläggande värden är positiva
  if (results.machinePriceSEK < 0) {
    errors.push('Maskinpris i SEK är negativt');
  }

  if (results.leasingCost < 0) {
    errors.push('Leasingkostnad är negativ');
  }

  if (context.machine?.usesCredits) {
    if (results.creditPrice < 0) {
      errors.push('Kreditpris är negativt');
    }
    
    // Kontrollera att creditpris är inom förväntad range
    if (context.machine.creditMin && context.machine.creditMax) {
      if (results.creditPrice < context.machine.creditMin * 0.5) {
        warnings.push(`Kreditpris (${results.creditPrice}) är mycket lägre än förväntad min (${context.machine.creditMin})`);
      }
      if (results.creditPrice > context.machine.creditMax * 1.5) {
        warnings.push(`Kreditpris (${results.creditPrice}) är mycket högre än förväntad max (${context.machine.creditMax})`);
      }
    }
  }

  // Validera intäkter
  if (results.revenue?.monthlyRevenueIncVat < 0) {
    errors.push('Månadsintäkt är negativ');
  }

  // Validera att strategisk leasingkostnad använder maskinens leasingMax
  if (context.selectedLeasingModel === 'strategisk' && context.machine?.leasingMax) {
    const expectedStrategicCost = context.machine.leasingMax;
    const actualStrategicCost = results.leasingCostStrategic || results.leasingCost;
    const deviation = Math.abs(expectedStrategicCost - actualStrategicCost) / expectedStrategicCost;
    
    if (deviation > 0.05) { // Mer än 5% avvikelse
      warnings.push(`Strategisk leasingkostnad (${actualStrategicCost}) avviker från förväntat värde (${expectedStrategicCost}) med ${(deviation * 100).toFixed(1)}%`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validerar växelkurs
 */
export function validateExchangeRate(rate: number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (rate <= 0) {
    errors.push('Växelkurs måste vara positiv');
  } else if (rate < 8 || rate > 15) {
    warnings.push(`Växelkurs (${rate}) ligger utanför normalt intervall (8-15)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Huvudvalidering som kombinerar alla valideringar
 */
export function validateAll(context: ValidationContext, results?: any): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Validera maskin om angiven
  if (context.machine) {
    const machineValidation = validateMachine(context.machine);
    allErrors.push(...machineValidation.errors);
    allWarnings.push(...machineValidation.warnings);
  }

  // Validera användarinput
  const inputValidation = validateUserInput(context);
  allErrors.push(...inputValidation.errors);
  allWarnings.push(...inputValidation.warnings);

  // Validera resultat om angivna
  if (results) {
    const resultsValidation = validateCalculationResults(results, context);
    allErrors.push(...resultsValidation.errors);
    allWarnings.push(...resultsValidation.warnings);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}