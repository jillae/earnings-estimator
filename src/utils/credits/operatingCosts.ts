
import { Machine } from '../../data/machines/types';
import { calculateTreatmentsPerMonth } from './treatmentCalculations';

export function calculateOperatingCost(
  machine: Machine,
  treatmentsPerDay: number,
  creditPrice: number,
  leasingCost: number = 0,
  useFlatrate: boolean = false,
  selectedLeasingPeriodId?: string,
  machinePriceSEK?: number
): { costPerMonth: number, useFlatrate: boolean } {
  if (!machine || !machine.usesCredits) {
    return { costPerMonth: 0, useFlatrate: false };
  }
  
  const safetreatmentsPerDay = Math.max(0, isNaN(treatmentsPerDay) ? 0 : treatmentsPerDay);
  const safeCreditPrice = Math.max(0, isNaN(creditPrice) ? 0 : creditPrice);
  
  console.log(`OPERATING COST CALCULATION:
    Machine: ${machine.name}
    Treatments per day: ${safetreatmentsPerDay}
    Credit price: ${safeCreditPrice}
    Use flatrate: ${useFlatrate}
    Flatrate amount: ${machine.flatrateAmount || 0}
  `);
  
  let costPerMonth = 0;
  
  if (useFlatrate) {
    costPerMonth = machine.flatrateAmount || 0;
    console.log(`Flatrate används för ${machine.name}: ${costPerMonth} kr/månad`);
  } else {
    const creditsPerTreatment = machine.creditsPerTreatment || 1;
    const treatmentsPerMonth = calculateTreatmentsPerMonth(safetreatmentsPerDay);
    costPerMonth = creditsPerTreatment * treatmentsPerMonth * safeCreditPrice;
    console.log(`Per-credit modell används för ${machine.name}: 
      ${creditsPerTreatment} credits/beh * ${treatmentsPerMonth} beh/mån * ${safeCreditPrice} kr/credit = ${costPerMonth} kr/mån`);
  }
  
  return { costPerMonth, useFlatrate };
}
