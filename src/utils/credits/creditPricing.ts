
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
      
    // Viktigt: För exakt trepunktsinterpolation
    // Punkterna är: 
    // 1. Vid leasingMin: creditMax
    // 2. Vid leasingMax (mittpunkt): creditMin
    // 3. Vid expanderade max (2*leasingMax-leasingMin): 0
    
    // Mittpunkt (gamla leasingMax)
    const midLeasingCost = machine.leasingMax;
    
    // Expanderade max (2*leasingMax-leasingMin)
    const expandedMaxLeasingCost = (2 * machine.leasingMax) - machine.leasingMin;
    
    let calculatedCreditPrice = 0;
    
    // Logga viktiga punkter för interpolation
    console.log(`CREDIT PRICE INTERPOLATION POINTS:
      Point 1 (Min): leasingCost=${machine.leasingMin}, creditPrice=${machine.creditMax}
      Point 2 (Mid): leasingCost=${midLeasingCost}, creditPrice=${machine.creditMin}
      Point 3 (Max): leasingCost=${expandedMaxLeasingCost}, creditPrice=0
      Current: leasingCost=${leasingCost}
    `);
    
    if (leasingCost <= midLeasingCost) {
      // Från leasingMin (0%) till midLeasingCost (50%)
      // Från creditMax till creditMin
      const factorInFirstHalf = (leasingCost - machine.leasingMin) / (midLeasingCost - machine.leasingMin);
      calculatedCreditPrice = machine.creditMax - factorInFirstHalf * (machine.creditMax - machine.creditMin);
      
      // Om vi är exakt vid mittpunkten (eller väldigt nära), använd exakt creditMin
      if (Math.abs(leasingCost - midLeasingCost) < 10) {
        calculatedCreditPrice = machine.creditMin;
        console.log(`Exakt vid mittpunkt (${midLeasingCost}), sätter pris till exact creditMin: ${machine.creditMin}`);
      }
    } else {
      // Från midLeasingCost (50%) till expandedMaxLeasingCost (100%)
      // Från creditMin till 0
      const factorInSecondHalf = (leasingCost - midLeasingCost) / (expandedMaxLeasingCost - midLeasingCost);
      calculatedCreditPrice = machine.creditMin * (1 - factorInSecondHalf);
    }
    
    console.log(`INTERPOLATION RESULT:
      Calculated Credit Price: ${Math.round(calculatedCreditPrice)} kr/credit
      Interpolation Details:
        - Using leasingCost: ${leasingCost}
        - First Half: ${leasingCost <= midLeasingCost}
        - Mid Leasing Cost: ${midLeasingCost}
        - Expanded Max: ${expandedMaxLeasingCost}
        - Expected creditMin at 50%: ${machine.creditMin}
        - Final Credit Price: ${Math.max(0, Math.round(calculatedCreditPrice))}
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
