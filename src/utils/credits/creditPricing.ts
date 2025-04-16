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
  
  console.log(`CREDIT PRICE CALCULATION DEBUG:
    Machine: ${machine.name}
    Leasing Cost: ${leasingCost}
    Payment Option: ${paymentOption}
    Machine Data:
      - creditMin: ${machine.creditMin}
      - creditMax: ${machine.creditMax}
      - leasingMin: ${machine.leasingMin}
      - leasingMax: ${machine.leasingMax}
  `);
  
  // Om kontantbetalning, returnera machine.creditMin
  if (paymentOption === 'cash') {
    console.log(`CASH PAYMENT: Returning creditMin: ${machine.creditMin || 149}`);
    return machine.creditMin || 149;
  }
  
  // Om vi har leasingMin, leasingMax, creditMin, creditMax - beräkna dynamiskt
  if (machine.leasingMin !== undefined && 
      machine.leasingMax !== undefined && 
      machine.creditMin !== undefined && 
      machine.creditMax !== undefined &&
      leasingCost >= machine.leasingMin) {
      
    const midLeasingCost = (machine.leasingMin + machine.leasingMax) / 2;
    
    let calculatedCreditPrice = 0;
    
    if (leasingCost <= midLeasingCost) {
      const factorInFirstHalf = (leasingCost - machine.leasingMin) / (midLeasingCost - machine.leasingMin);
      calculatedCreditPrice = machine.creditMax - factorInFirstHalf * (machine.creditMax - machine.creditMin);
    } else {
      const factorInSecondHalf = (leasingCost - midLeasingCost) / (machine.leasingMax - midLeasingCost);
      calculatedCreditPrice = machine.creditMin * (1 - factorInSecondHalf);
    }
    
    console.log(`INTERPOLATION RESULT:
      Calculated Credit Price: ${Math.round(calculatedCreditPrice)} kr/credit
      Interpolation Details:
        - First Half Factor: ${(leasingCost <= midLeasingCost).toString()}
        - Mid Leasing Cost: ${midLeasingCost}
    `);
    
    return Math.max(0, Math.round(calculatedCreditPrice));
  }
  
  // Fallback till standardvärde om inget annat fungerar
  console.log(`FALLBACK: Returning default credit price of ${machine.creditMin || 149}`);
  return machine.creditMin || 149;
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
