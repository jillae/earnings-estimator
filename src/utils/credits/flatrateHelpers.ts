
import { Machine } from '../../data/machines/types';
import { WORKING_DAYS_PER_MONTH } from '../constants';

export function shouldUseFlatrate(
  machine: Machine,
  leasingCost: number,
  treatmentsPerDay: number,
  allowBelowFlatrate: boolean,
  paymentOption: 'leasing' | 'cash' = 'leasing',
  selectedLeasingPeriodId?: string,
  machinePriceSEK?: number
): boolean {
  if (!machine || !machine.usesCredits || !machine.flatrateAmount) {
    return false;
  }
  
  const safeLeasingCost = Math.max(0, isNaN(leasingCost) ? 0 : leasingCost);
  const safetreatmentsPerDay = isNaN(treatmentsPerDay) ? 0 : treatmentsPerDay;
  
  const minTreatments = safetreatmentsPerDay >= 3;
  
  if (paymentOption === 'cash') {
    return minTreatments;
  }
  
  // Beräkna tröskelvärdet som är 80% mellan min och mittpunkt (inte max)
  const oldLeasingMax = (machine.leasingMin + machine.leasingMax) / 2;
  const thresholdValue = machine.leasingMin + (oldLeasingMax - machine.leasingMin) * 0.8;
  
  const meetsLeasingRequirement = allowBelowFlatrate || safeLeasingCost >= thresholdValue;
  const canUseFlatrate = meetsLeasingRequirement && minTreatments;
  
  console.log(`shouldUseFlatrate för ${machine.name}:
    paymentOption: ${paymentOption}
    leasingCost: ${safeLeasingCost}
    leasingMin: ${machine.leasingMin}
    oldLeasingMax (mittpunkt): ${oldLeasingMax}
    thresholdValue (80%): ${thresholdValue}
    treatmentsPerDay: ${safetreatmentsPerDay}
    allowBelowFlatrate: ${allowBelowFlatrate}
    meetsLeasingRequirement: ${meetsLeasingRequirement}
    minTreatments: ${minTreatments}
    canUseFlatrate: ${canUseFlatrate}
  `);
  
  return canUseFlatrate;
}

export function calculateFlatrateBreakEven(
  flatrateAmount: number,
  creditPrice: number,
  creditsPerTreatment: number = 1
): number {
  if (isNaN(flatrateAmount) || isNaN(creditPrice) || flatrateAmount <= 0 || creditPrice <= 0) {
    return 0;
  }
  
  const breakEvenTreatmentsPerMonth = flatrateAmount / (creditPrice * creditsPerTreatment);
  return Math.ceil(breakEvenTreatmentsPerMonth / WORKING_DAYS_PER_MONTH);
}
