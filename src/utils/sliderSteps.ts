import { Machine } from '@/data/machines/types';
import { roundToHundredEndingSix } from './formatUtils';
import { PiecewiseLinearCalculator, MachinePricingData } from './core/PiecewiseLinearCalculator';

export type SliderStep = 0 | 1 | 2 | 3 | 4;

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
  creditMax: number = 299,
  creditMid1: number = 225,
  creditMid2: number = 149,
  creditMid3: number = 75
): Record<SliderStep, StepValues> {
  // Defaultvärden för null-maskin
  if (!machine || machine.id === 'null-machine' || machine.id === 'select-machine') {
    return {
      0: { leasingCost: 0, creditPrice: 0, label: 'Min' },
      1: { leasingCost: 0, creditPrice: 0, label: 'Låg' },
      2: { leasingCost: 0, creditPrice: 0, label: 'Standard' },
      3: { leasingCost: 0, creditPrice: 0, label: 'Hög' },
      4: { leasingCost: 0, creditPrice: 0, label: 'Max' }
    };
  }

  

  // För maskiner som använder credits, använd strategisk prissättningsmodell
  if (machine.usesCredits && machine.leasingMin && machine.leasingStandard && machine.leasingMax && 
      machine.creditMax && machine.creditMid1 && machine.creditMid2 && machine.creditMid3) {
    const pricingData: MachinePricingData = {
      leasingMin: machine.leasingMin,
      leasingStandard: machine.leasingStandard,
      leasingMax: machine.leasingMax,
      creditMax: machine.creditMax,
      creditMid1: machine.creditMid1,
      creditMid2: machine.creditMid2,
      creditMid3: machine.creditMid3
    };

    const calculator = new PiecewiseLinearCalculator(pricingData);
    
    // Validera prissättningsmodellen
    const validation = calculator.validate();
    if (!validation.isValid) {
      console.warn(`Valideringsfel för ${machine.name}:`, validation.errors);
    }

    // Beräkna alla steg med styckvis linjär interpolering
    const step0 = calculator.interpolate(0);    // Min
    const step1 = calculator.interpolate(1);    // Låg
    const step2 = calculator.interpolate(2);    // Standard
    const step3 = calculator.interpolate(3);    // Hög
    const step4 = calculator.interpolate(4);    // Max

    // Avrunda leasingkostnader till hundra slutande på 6
    const roundedStep0 = { 
      ...step0, 
      leasingCost: roundToHundredEndingSix(step0.leasingCost),
      creditPrice: roundToEndingNine(step0.creditPrice)
    };
    const roundedStep1 = { 
      ...step1, 
      leasingCost: roundToHundredEndingSix(step1.leasingCost),
      creditPrice: roundToEndingNine(step1.creditPrice)
    };
    const roundedStep2 = { 
      ...step2, 
      leasingCost: roundToHundredEndingSix(step2.leasingCost),
      creditPrice: machine.creditMid2 || 149  // Använd det exakta värdet från maskin
    };
    const roundedStep3 = { 
      ...step3, 
      leasingCost: roundToHundredEndingSix(step3.leasingCost),
      creditPrice: roundToEndingNine(step3.creditPrice)
    };
    const roundedStep4 = { 
      ...step4, 
      leasingCost: roundToHundredEndingSix(step4.leasingCost)
    };


    return {
      0: { leasingCost: roundedStep0.leasingCost, creditPrice: roundedStep0.creditPrice, label: 'Min' },
      1: { leasingCost: roundedStep1.leasingCost, creditPrice: roundedStep1.creditPrice, label: 'Låg' },
      2: { leasingCost: roundedStep2.leasingCost, creditPrice: roundedStep2.creditPrice, label: 'Standard' },
      3: { leasingCost: roundedStep3.leasingCost, creditPrice: roundedStep3.creditPrice, label: 'Hög' },
      4: { leasingCost: roundedStep4.leasingCost, creditPrice: 0, label: 'Max' }
    };
  }

  // Fallback för gamla maskiner utan strategisk prissättning
  
  
  // Hämta kreditvärden från maskinen eller använd standardvärden
  let machineMaxCredit = machine.creditMax || creditMax;
  let machineMid1Credit = machine.creditMid1 || creditMid1;
  let machineMid2Credit = machine.creditMid2 || creditMid2;
  let machineMid3Credit = machine.creditMid3 || creditMid3;

  // Avrunda krediter till att sluta på 9
  machineMaxCredit = roundToEndingNine(machineMaxCredit);
  machineMid1Credit = roundToEndingNine(machineMid1Credit);
  machineMid2Credit = roundToEndingNine(machineMid2Credit);
  machineMid3Credit = roundToEndingNine(machineMid3Credit);

  // Säkerställ att leasingvärden är giltiga
  const safeMin = Math.max(0, leasingMin || 0);
  const safeDefault = Math.max(safeMin, leasingDefault || 0);
  const safeMax = Math.max(safeDefault, leasingMax || 0);

  // Beräkna mellanliggande leasingvärden för 5 steg
  const leasing1 = safeMin + (safeDefault - safeMin) * 0.5;
  const leasing3 = safeDefault + (safeMax - safeDefault) * 0.5;

  // Avrunda leasingvärden till närmaste hundra slutande på 6
  const roundedMin = roundToHundredEndingSix(safeMin);
  const roundedLow = roundToHundredEndingSix(leasing1);
  const roundedStandard = roundToHundredEndingSix(safeDefault);
  const roundedHigh = roundToHundredEndingSix(leasing3);
  const roundedMax = roundToHundredEndingSix(safeMax);

  return {
    0: { leasingCost: roundedMin, creditPrice: machineMaxCredit, label: 'Min' },
    1: { leasingCost: roundedLow, creditPrice: machineMid1Credit, label: 'Låg' },
    2: { leasingCost: roundedStandard, creditPrice: machineMid2Credit, label: 'Standard' },
    3: { leasingCost: roundedHigh, creditPrice: machineMid3Credit, label: 'Hög' },
    4: { leasingCost: roundedMax, creditPrice: 0, label: 'Max' }
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
