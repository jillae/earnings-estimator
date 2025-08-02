import { Machine } from '@/data/machines/types';
import { roundToHundredEndingSix } from './formatUtils';
import { PiecewiseLinearCalculator, MachinePricingData } from './core/PiecewiseLinearCalculator';

export type SliderStep = 0 | 0.5 | 1 | 1.5 | 2;

export interface StepValues {
  leasingCost: number;
  creditPrice: number;
  label: string;
}

/**
 * Rundar av ett värde så att det slutar på 9
 */
function roundToEndingNine(value: number): number {
  const rounded = Math.round(value);
  const lastDigit = rounded % 10;
  return rounded - lastDigit + 9;
}

/**
 * Beräknar värdepar för de 5 fasta stegen på slidern för en given maskin
 * Använder strategisk prissättningsmodell med styckvis linjär interpolering
 */
export function calculateStepValues(
  machine: Machine | undefined,
  leasingMin: number,
  leasingDefault: number,
  leasingMax: number,
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

  console.log(`calculateStepValues för ${machine.name} (${machine.id}) - STRATEGISK MODELL:`);

  // För maskiner som använder credits, använd strategisk prissättningsmodell
  if (machine.usesCredits && machine.leasingMin && machine.leasingStandard && machine.leasingMax) {
    const pricingData: MachinePricingData = {
      leasingMin: machine.leasingMin,
      leasingStandard: machine.leasingStandard,
      leasingMax: machine.leasingMax,
      creditMin: machine.creditMin || 149,
      creditMax: machine.creditMax || 299
    };

    const calculator = new PiecewiseLinearCalculator(pricingData);
    
    // Validera prissättningsmodellen
    const validation = calculator.validate();
    if (!validation.isValid) {
      console.warn(`Valideringsfel för ${machine.name}:`, validation.errors);
    }

    // Beräkna alla steg med styckvis linjär interpolering
    const step0 = calculator.interpolate(0);    // Min
    const step05 = calculator.interpolate(0.5); // Låg
    const step1 = calculator.interpolate(1);    // Standard
    const step15 = calculator.interpolate(1.5); // Hög
    const step2 = calculator.interpolate(2);    // Max

    // Avrunda leasingkostnader till hundra slutande på 6
    const roundedStep0 = { 
      ...step0, 
      leasingCost: roundToHundredEndingSix(step0.leasingCost),
      creditPrice: roundToEndingNine(step0.creditPrice)
    };
    const roundedStep05 = { 
      ...step05, 
      leasingCost: roundToHundredEndingSix(step05.leasingCost),
      creditPrice: roundToEndingNine(step05.creditPrice)
    };
    const roundedStep1 = { 
      ...step1, 
      leasingCost: roundToHundredEndingSix(step1.leasingCost),
      creditPrice: 149  // FAST VÄRDE för standard - ska alltid vara 149
    };
    const roundedStep15 = { 
      ...step15, 
      leasingCost: roundToHundredEndingSix(step15.leasingCost),
      creditPrice: roundToEndingNine(step15.creditPrice)
    };
    const roundedStep2 = { 
      ...step2, 
      leasingCost: roundToHundredEndingSix(step2.leasingCost)
    };

    console.log(`STRATEGISKA stegvärden för ${machine.name} - KORREKT SLIDER LOGIK:
      Min (0): ${roundedStep0.leasingCost} kr leasing / ${roundedStep0.creditPrice} kr credit (VÄNSTER - HÖG CREDIT)
      Låg (0.5): ${roundedStep05.leasingCost} kr leasing / ${roundedStep05.creditPrice} kr credit
      Standard (1): ${roundedStep1.leasingCost} kr leasing / ${roundedStep1.creditPrice} kr credit (MITTEN - BALANSERAD)
      Hög (1.5): ${roundedStep15.leasingCost} kr leasing / ${roundedStep15.creditPrice} kr credit
      Max (2): ${roundedStep2.leasingCost} kr leasing / 0 kr credit (HÖGER - NOLL CREDIT)`);

    return {
      0: { leasingCost: roundedStep0.leasingCost, creditPrice: roundedStep0.creditPrice, label: 'Min' },
      0.5: { leasingCost: roundedStep05.leasingCost, creditPrice: roundedStep05.creditPrice, label: 'Låg' },
      1: { leasingCost: roundedStep1.leasingCost, creditPrice: roundedStep1.creditPrice, label: 'Standard' },
      1.5: { leasingCost: roundedStep15.leasingCost, creditPrice: roundedStep15.creditPrice, label: 'Hög' },
      2: { leasingCost: roundedStep2.leasingCost, creditPrice: 0, label: 'Max' }
    };
  }

  // Fallback för gamla maskiner utan strategisk prissättning
  console.log(`Använder fallback-logik för ${machine.name} (saknar strategisk prissättning)`);
  
  // Hämta kreditvärden från maskinen eller använd standardvärden
  let machineMinCredit = machine.creditMin || creditMin;
  let machineMaxCredit = machine.creditMax || creditMax;

  // Avrunda krediter till att sluta på 9
  machineMinCredit = roundToEndingNine(machineMinCredit);
  machineMaxCredit = roundToEndingNine(machineMaxCredit);

  // Säkerställ att leasingvärden är giltiga
  const safeMin = Math.max(0, leasingMin || 0);
  const safeDefault = Math.max(safeMin, leasingDefault || 0);
  const safeMax = Math.max(safeDefault, leasingMax || 0);

  // Beräkna mellanliggande leasingvärden (25% och 75% av vägen)
  const leasing25Percent = safeMin + (safeDefault - safeMin) * 0.5;
  const leasing75Percent = safeDefault + (safeMax - safeDefault) * 0.5;

  // Beräkna mellanliggande kreditvärden med korrekt interpolation
  let credit25Percent = machineMaxCredit - (machineMaxCredit - machineMinCredit) * 0.5;
  credit25Percent = roundToEndingNine(credit25Percent);
  
  let credit75Percent = machineMinCredit * 0.5;
  credit75Percent = roundToEndingNine(credit75Percent);

  // Avrunda leasingvärden till närmaste hundra slutande på 6
  const roundedMin = roundToHundredEndingSix(safeMin);
  const roundedLow = roundToHundredEndingSix(leasing25Percent);
  const roundedStandard = roundToHundredEndingSix(safeDefault);
  const roundedHigh = roundToHundredEndingSix(leasing75Percent);
  const roundedMax = roundToHundredEndingSix(safeMax);

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
