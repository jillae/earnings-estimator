
import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { FlatrateOption } from '@/types/calculator';

export const useFlatrateHandler = () => {
  const { 
    leasingCost,
    flatrateThreshold,
    paymentOption,
    leasingRange,
    setLeaseAdjustmentFactor,
    setUseFlatrateOption
  } = useCalculator();

  const handleFlatrateChange = (checked: boolean) => {
    // Först, ändra flatrate-alternativet
    setUseFlatrateOption(checked ? 'flatrate' : 'perCredit');
    
    // Om användaren aktiverar flatrate och är under tröskelvärdet, justera slidern automatiskt
    if (checked && flatrateThreshold && leasingCost < flatrateThreshold && paymentOption === 'leasing') {
      // Beräkna den nya justeringsfaktorn för att nå tröskelvärdet
      const thresholdFactor = leasingRange.max > leasingRange.min
        ? (flatrateThreshold - leasingRange.min) / (leasingRange.max - leasingRange.min)
        : 0.8; // Fallback till 80% om beräkningen misslyckas
      
      console.log(`Justerar slider automatiskt till flatrate-tröskelvärdet:
        Nuvarande leasingkostnad: ${leasingCost}
        Tröskelvärde: ${flatrateThreshold}
        Beräknad justeringsfaktor: ${thresholdFactor}
      `);
      
      // Uppdatera slidern till tröskelvärdet (minst 80%)
      setLeaseAdjustmentFactor(Math.max(0.8, thresholdFactor));
    }
  };

  return {
    handleFlatrateChange
  };
};
