
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
      
    // Vi behöver veta vad som är 50% av leasingrange
    const midLeasingCost = (machine.leasingMin + machine.leasingMax) / 2;
    
    let calculatedCreditPrice = 0;
    
    // Korrigerad interpolationslogik:
    // 1. Vid leasingMin (slider 0%) -> creditMax
    // 2. Vid midLeasingCost (slider 50%) -> creditMin 
    // 3. Vid leasingMax (slider 100%) -> 0
    
    if (leasingCost <= midLeasingCost) {
      // Mellan leasingMin (0%) och midLeasingCost (50%)
      // Här går vi från creditMax till creditMin
      const factorInFirstHalf = (leasingCost - machine.leasingMin) / (midLeasingCost - machine.leasingMin);
      calculatedCreditPrice = machine.creditMax - factorInFirstHalf * (machine.creditMax - machine.creditMin);
    } else {
      // Mellan midLeasingCost (50%) och leasingMax (100%)
      // Här går vi från creditMin till 0
      const factorInSecondHalf = (leasingCost - midLeasingCost) / (machine.leasingMax - midLeasingCost);
      calculatedCreditPrice = machine.creditMin * (1 - factorInSecondHalf);
    }
    
    console.log(`Kreditprisberäkning för ${machine.name}:
      Leasingkostnad: ${leasingCost}
      LeasingMin (0%): ${machine.leasingMin}
      MidLeasingCost (50%): ${midLeasingCost}
      LeasingMax (100%): ${machine.leasingMax}
      CreditMin (vid 50%): ${machine.creditMin}
      CreditMax (vid 0%): ${machine.creditMax}
      Beräknat kreditpris: ${Math.round(calculatedCreditPrice)} kr/credit
    `);
    
    // Avrunda och säkerställ att vi aldrig returnerar ett negativt värde
    return Math.max(0, Math.round(calculatedCreditPrice));
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
