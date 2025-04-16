
import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { FlatrateOption } from '@/types/calculator';

export const useFlatrateHandler = () => {
  const { 
    leasingCost,
    flatrateThreshold,
    paymentOption,
    setLeaseAdjustmentFactor,
    setUseFlatrateOption
  } = useCalculator();

  const handleFlatrateChange = (checked: boolean) => {
    // Först, ändra flatrate-alternativet
    setUseFlatrateOption(checked ? 'flatrate' : 'perCredit');
    
    // Om användaren aktiverar flatrate och är under tröskelvärdet, justera slidern automatiskt
    if (checked && flatrateThreshold && leasingCost < flatrateThreshold && paymentOption === 'leasing') {
      // Beräkna den nya justeringsfaktorn för att nå tröskelvärdet
      const thresholdFactor = 0.8; // Default till 80% om under tröskelvärdet
      
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

