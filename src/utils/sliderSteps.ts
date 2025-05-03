
import { Machine } from '@/data/machines/types';
import { roundToHundredEndingSix } from './formatUtils';

export type SliderStep = 0 | 0.5 | 1 | 1.5 | 2;

export interface StepValues {
  leasingCost: number;
  creditPrice: number;
  label: string;
}

/**
 * Beräknar värdepar för de 5 fasta stegen på slidern för en given maskin
 */
export function calculateStepValues(
  machine: Machine | undefined,
  leasingMin: number,
  leasingDefault: number, // Ändrat from leasingMaxOld till leasingDefault för tydlighet
  leasingMax: number, // Ändrat från leasingMaxNew till leasingMax för tydlighet
  creditMin: number = 149,
  creditMax: number = 299
): Record<SliderStep, StepValues> {
  // Defaultvärden för null-maskin
  if (!machine || machine.id === 'null-machine' || machine.id === 'select-machine') {
    return {
      0: { leasingCost: 0, creditPrice: 0, label: 'Min' },
      0.5: { leasingCost: 0, creditPrice: 0, label: 'Låg' },
      1: { leasingCost: 0, creditPrice: 0, label: 'Standard' },
      1.5: { leasingCost: 0, creditPrice: 0, label: 'Hög' },
      2: { leasingCost: 0, creditPrice: 0, label: 'Max' }
    };
  }

  // Hämta kreditvärden från maskinen eller använd standardvärden
  // VIKTIGT: Använd exakt de värden som definierats i maskindatat
  const machineMinCredit = machine.creditMin || creditMin;
  const machineMaxCredit = machine.creditMax || creditMax;

  // Säkerställ att leasingvärden är giltiga
  const safeMin = Math.max(0, leasingMin || 0);
  const safeDefault = Math.max(safeMin, leasingDefault || 0);
  const safeMax = Math.max(safeDefault, leasingMax || 0);

  // Beräkna mellanliggande leasingvärden (25% och 75% av vägen)
  const leasing25Percent = safeMin + (safeDefault - safeMin) * 0.5;
  const leasing75Percent = safeDefault + (safeMax - safeDefault) * 0.5;

  // Beräkna mellanliggande kreditvärden med korrekt interpolation
  // VIKTIGT: Ingen avrundning här!
  const credit25Percent = machineMaxCredit - (machineMaxCredit - machineMinCredit) * 0.5;
  const credit75Percent = machineMinCredit * 0.5; // Halvvägs mellan min och 0

  // Avrunda leasingvärden till närmaste hundra slutande på 6
  const roundedMin = roundToHundredEndingSix(safeMin);
  const roundedLow = roundToHundredEndingSix(leasing25Percent);
  const roundedStandard = roundToHundredEndingSix(safeDefault);
  const roundedHigh = roundToHundredEndingSix(leasing75Percent);
  const roundedMax = roundToHundredEndingSix(safeMax);

  // VIKTIGT: Lägg till en tydlig logg för att visa exakt vilka kreditsvärdena blir för varje maskin
  console.log(`Beräknade stegvärden för ${machine.name}:
    Min (0): ${roundedMin} kr / ${machineMaxCredit} kr per credit (exakt värde)
    Låg (0.5): ${roundedLow} kr / ${credit25Percent} kr per credit (exakt värde)
    Standard (1): ${roundedStandard} kr / ${machineMinCredit} kr per credit (exakt värde)
    Hög (1.5): ${roundedHigh} kr / ${credit75Percent} kr per credit (exakt värde)
    Max (2): ${roundedMax} kr / 0 kr per credit
    
    Detaljer:
    - leasingMin from input: ${leasingMin}
    - leasingDefault from input: ${leasingDefault}
    - leasingMax from input: ${leasingMax}
    - creditMin for machine: ${machineMinCredit}
    - creditMax for machine: ${machineMaxCredit}
  `);

  return {
    0: { leasingCost: roundedMin, creditPrice: machineMaxCredit, label: 'Min' },
    0.5: { leasingCost: roundedLow, creditPrice: credit25Percent, label: 'Låg' },
    1: { leasingCost: roundedStandard, creditPrice: machineMinCredit, label: 'Standard' },
    1.5: { leasingCost: roundedHigh, creditPrice: credit75Percent, label: 'Hög' },
    2: { leasingCost: roundedMax, creditPrice: 0, label: 'Max' }
  };
}

/**
 * Hämtar värden för ett specifikt steg
 */
export function getStepValues(
  stepValues: Record<SliderStep, StepValues>,
  currentStep: SliderStep
): StepValues {
  return stepValues[currentStep] || stepValues[1]; // Fallback till standard (steg 1)
}
