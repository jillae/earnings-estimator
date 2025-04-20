
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
  leasingMaxOld: number,
  leasingMaxNew: number,
  creditMin: number = 149,
  creditMax: number = 299
): Record<SliderStep, StepValues> {
  // Defaultvärden för null-maskin
  if (!machine) {
    return {
      0: { leasingCost: 0, creditPrice: 0, label: 'Min' },
      0.5: { leasingCost: 0, creditPrice: 0, label: 'Låg' },
      1: { leasingCost: 0, creditPrice: 0, label: 'Standard' },
      1.5: { leasingCost: 0, creditPrice: 0, label: 'Hög' },
      2: { leasingCost: 0, creditPrice: 0, label: 'Max' }
    };
  }

  // Hämta kreditvärden från maskinen eller använd standardvärden
  const machineMinCredit = machine.creditMin || creditMin;
  const machineMaxCredit = machine.creditMax || creditMax;

  // Säkerställ att leasingvärden är giltiga
  const safeMin = Math.max(0, leasingMin || 0);
  const safeMaxOld = Math.max(safeMin, leasingMaxOld || 0);
  const safeMaxNew = Math.max(safeMaxOld, leasingMaxNew || 0);

  // Beräkna mellanliggande leasingvärden (25% och 75%)
  const leasing25Percent = safeMin + (safeMaxOld - safeMin) * 0.5;
  const leasing75Percent = safeMaxOld + (safeMaxNew - safeMaxOld) * 0.5;

  // Beräkna mellanliggande kreditvärden med korrekt interpolation
  const credit25Percent = machineMaxCredit - (machineMaxCredit - machineMinCredit) * 0.5;
  const credit75Percent = machineMinCredit * 0.5; // Halvvägs mellan min och 0

  // Avrunda leasingvärden till närmaste hundra slutande på 6
  const roundedMin = roundToHundredEndingSix(safeMin);
  const roundedLow = roundToHundredEndingSix(leasing25Percent);
  const roundedStandard = roundToHundredEndingSix(safeMaxOld);
  const roundedHigh = roundToHundredEndingSix(leasing75Percent);
  const roundedMax = roundToHundredEndingSix(safeMaxNew);

  console.log(`Beräknade stegvärden för ${machine.name}:
    Min (0): ${roundedMin} kr / ${machineMaxCredit} kr per credit
    Låg (0.5): ${roundedLow} kr / ${Math.round(credit25Percent)} kr per credit
    Standard (1): ${roundedStandard} kr / ${machineMinCredit} kr per credit
    Hög (1.5): ${roundedHigh} kr / ${Math.round(credit75Percent)} kr per credit
    Max (2): ${roundedMax} kr / 0 kr per credit
  `);

  return {
    0: { leasingCost: roundedMin, creditPrice: machineMaxCredit, label: 'Min' },
    0.5: { leasingCost: roundedLow, creditPrice: Math.round(credit25Percent), label: 'Låg' },
    1: { leasingCost: roundedStandard, creditPrice: machineMinCredit, label: 'Standard' },
    1.5: { leasingCost: roundedHigh, creditPrice: Math.round(credit75Percent), label: 'Hög' },
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
