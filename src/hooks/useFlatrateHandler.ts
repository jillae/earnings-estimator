
import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { FlatrateOption } from '@/types/calculator';
import { useToast } from '@/hooks/use-toast';

export const useFlatrateHandler = () => {
  const { 
    leasingCost,
    flatrateThreshold,
    paymentOption,
    leasingRange,
    setLeaseAdjustmentFactor,
    setUseFlatrateOption,
    treatmentsPerDay
  } = useCalculator();

  const { toast } = useToast();

  const meetsMinTreatments = treatmentsPerDay >= 3;
  const meetsLeasingRequirement = flatrateThreshold && leasingCost >= flatrateThreshold;
  const canEnableFlatrate = meetsMinTreatments && (paymentOption === 'cash' || meetsLeasingRequirement);

  const handleFlatrateChange = (checked: boolean) => {
    // Om användaren försöker aktivera flatrate men inte uppfyller kriterierna, visa ett felmeddelande
    if (checked && !canEnableFlatrate) {
      if (!meetsMinTreatments) {
        toast({
          title: "Kan inte aktivera Flatrate",
          description: "Du behöver minst 3 behandlingar per dag för att kunna använda Flatrate.",
          variant: "destructive"
        });
      } else if (paymentOption === 'leasing' && !meetsLeasingRequirement) {
        toast({
          title: "Kan inte aktivera Flatrate",
          description: "Du behöver öka leasingkostnaden till minst 80% av ordinarie pris för att använda Flatrate.",
          variant: "destructive"
        });
      }
      return; // Avbryt aktiveringen av flatrate
    }
    
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
    handleFlatrateChange,
    canEnableFlatrate
  };
};
