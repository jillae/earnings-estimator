
import { useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { FlatrateOption } from '@/utils/constants';
import { useToast } from '@/hooks/use-toast';

export const useFlatrateHandler = () => {
  const { 
    leasingCost,
    flatrateThreshold,
    paymentOption,
    leasingRange,
    setLeaseAdjustmentFactor,
    useFlatrateOption,
    setUseFlatrateOption,
    treatmentsPerDay,
    selectedSlaLevel
  } = useCalculator();

  const { toast } = useToast();

  // Kontrollera om Flatrate kan aktiveras
  const meetsMinTreatments = treatmentsPerDay >= 3;
  
  // Leasing-kravet gäller bara vid leasingbetalning, inte vid kontant
  const meetsLeasingRequirement = 
    paymentOption === 'cash' || // Vid kontant är kravet alltid uppfyllt
    (flatrateThreshold && leasingCost >= flatrateThreshold); // Vid leasing måste vi nå tröskelvärdet
  
  const canEnableFlatrate = meetsMinTreatments && meetsLeasingRequirement;

  // Automatiskt återställ flatrate-läget när villkoren inte längre uppfylls
  useEffect(() => {
    if (useFlatrateOption === 'flatrate' && !canEnableFlatrate) {
      console.log(`Återställer automatiskt Flatrate till 'perCredit' eftersom villkoren inte uppfylls:
        treatmentsPerDay: ${treatmentsPerDay} (min 3 krävs)
        leasingCost: ${leasingCost}
        flatrateThreshold: ${flatrateThreshold}
        paymentOption: ${paymentOption}
        canEnableFlatrate: ${canEnableFlatrate}
      `);
      setUseFlatrateOption('perCredit');
      
      toast({
        title: "Flatrate har inaktiverats",
        description: meetsMinTreatments 
          ? "Leasingkostnaden är för låg för att aktivera Flatrate." 
          : "Minst 3 behandlingar per dag krävs för Flatrate.",
        variant: "default"
      });
    }
  }, [treatmentsPerDay, leasingCost, flatrateThreshold, paymentOption, canEnableFlatrate, useFlatrateOption, setUseFlatrateOption]);

  // Automatiskt återställ flatrate-läget när SLA-nivån ändras från Brons
  useEffect(() => {
    if (selectedSlaLevel !== 'Brons' && useFlatrateOption === 'flatrate') {
      console.log(`Återställer automatiskt Flatrate till 'perCredit' eftersom SLA-nivån ändrades till ${selectedSlaLevel}`);
      setUseFlatrateOption('perCredit');
    }
  }, [selectedSlaLevel, useFlatrateOption, setUseFlatrateOption]);

  const handleFlatrateChange = (checked: boolean) => {
    console.log(`Flatrate toggle ändrad till: ${checked}, kan aktiveras: ${canEnableFlatrate}`);
    
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
          description: "Du behöver öka leasingkostnaden till rekommenderat pris för att använda Flatrate.",
          variant: "destructive"
        });
      }
      return; // Avbryt aktiveringen av flatrate
    }
    
    // Ändra flatrate-alternativet
    setUseFlatrateOption(checked ? 'flatrate' : 'perCredit');
    
    // Om användaren aktiverar flatrate och är under tröskelvärdet, justera slidern automatiskt
    if (checked && flatrateThreshold && leasingCost < flatrateThreshold && paymentOption === 'leasing') {
      // Beräkna den nya justeringsfaktorn för att nå tröskelvärdet
      const thresholdFactor = leasingRange.max > leasingRange.min
        ? (flatrateThreshold - leasingRange.min) / (leasingRange.max - leasingRange.min)
        : 0.5; // Fallback till 50% om beräkningen misslyckas
      
      console.log(`Justerar slider automatiskt till flatrate-tröskelvärdet:
        Nuvarande leasingkostnad: ${leasingCost}
        Tröskelvärde: ${flatrateThreshold}
        Beräknad justeringsfaktor: ${thresholdFactor}
      `);
      
      // Uppdatera slidern till tröskelvärdet (minst 0.5)
      setLeaseAdjustmentFactor(Math.max(0.5, thresholdFactor));
    }
  };

  return {
    handleFlatrateChange,
    canEnableFlatrate
  };
};
