
import { Machine } from '../../data/machines/types';

/**
 * Beräknar och returnerar priset per credit baserat på maskintyp och leasingkostnad
 * med förbättrad linjär interpolation enligt den nya logiken
 */
export function calculateCreditPrice(
  machine: Machine, 
  leasingCost: number,
  paymentOption: 'leasing' | 'cash' = 'leasing',
  selectedLeasingPeriodId?: string,
  machinePriceSEK?: number
): number {
  if (!machine || !machine.usesCredits) return 0;
  
  console.log(`Beräknar kreditpris för ${machine.name}:
    - paymentOption: ${paymentOption}
    - leasingCost: ${leasingCost}
    - machine.leasingMin: ${machine.leasingMin}
    - machine.leasingMax: ${machine.leasingMax}
    - machine.creditMin: ${machine.creditMin}
    - machine.creditMax: ${machine.creditMax}
  `);
  
  // Om kontantbetalning, returnera machine.creditMin
  if (paymentOption === 'cash') {
    console.log(`Kontantbetalning vald, använder creditMin: ${machine.creditMin}`);
    return machine.creditMin || 149;
  }
  
  // Om vi har leasingMin, leasingMax, creditMin, creditMax - beräkna dynamiskt
  if (machine.leasingMin !== undefined && 
      machine.leasingMax !== undefined && 
      machine.creditMin !== undefined && 
      machine.creditMax !== undefined &&
      leasingCost >= machine.leasingMin) {
      
    // Beräkna det gamla leasingMax värdet (mittpunkten i den nya skalan)
    const oldLeasingMax = (machine.leasingMin + machine.leasingMax) / 2;
    
    let calculatedCreditPrice = 0;
    
    // Trepunktsinterpolation:
    // 1. MinLease -> CreditMax
    // 2. MidPoint -> CreditMin
    // 3. MaxLease -> 0
    if (leasingCost <= oldLeasingMax) {
      // Mellan leasingMin och oldLeasingMax (mittpunkten)
      // Här går vi från creditMax till creditMin
      const factorInFirstHalf = (leasingCost - machine.leasingMin) / (oldLeasingMax - machine.leasingMin);
      calculatedCreditPrice = machine.creditMax - factorInFirstHalf * (machine.creditMax - machine.creditMin);
    } else {
      // Mellan oldLeasingMax (mittpunkten) och leasingMax
      // Här går vi från creditMin till 0
      const factorInSecondHalf = (leasingCost - oldLeasingMax) / (machine.leasingMax - oldLeasingMax);
      calculatedCreditPrice = machine.creditMin * (1 - factorInSecondHalf);
    }
    
    console.log(`Trepunktsinterpolation av kreditpris för ${machine.name}:
      Leasingkostnad: ${leasingCost}
      LeasingMin: ${machine.leasingMin}
      Gamla leasingMax (mittpunkt): ${oldLeasingMax}
      LeasingMax: ${machine.leasingMax}
      CreditMin: ${machine.creditMin}
      CreditMax: ${machine.creditMax}
      Beräknat kreditpris: ${Math.round(calculatedCreditPrice)} kr/credit
    `);
    
    return Math.round(calculatedCreditPrice);
  }
  
  // Fallback till standardvärde om inget annat fungerar
  const defaultCreditPrice = machine.creditMin || 149;
  console.log(`Använder standardvärde ${defaultCreditPrice} för credits för ${machine.name}`);
  return defaultCreditPrice;
}

export function calculateCreditPriceWithDirectInterpolation(
  adjustmentFactor: number,
  creditMin: number,
  creditMax: number
): number {
  const clampedFactor = Math.max(0, Math.min(1, adjustmentFactor));
  const creditValue = creditMin + clampedFactor * (creditMax - creditMin);
  return Math.round(creditValue);
}
