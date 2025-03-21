
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';

export function useOperatingCosts({
  selectedMachineId,
  treatmentsPerDay,
  leasingCost,
  selectedLeasingPeriodId,
  machinePriceSEK,
  allowBelowFlatrate,
  useFlatrateOption = 'perCredit'
}: {
  selectedMachineId: string;
  treatmentsPerDay: number;
  leasingCost: number;
  selectedLeasingPeriodId: string;
  machinePriceSEK: number;
  allowBelowFlatrate: boolean;
  useFlatrateOption?: 'perCredit' | 'flatrate';
}) {
  const [operatingCost, setOperatingCost] = useState<{ costPerMonth: number, useFlatrate: boolean }>({ 
    costPerMonth: 0, 
    useFlatrate: false 
  });
  
  // Beräkna och spara kreditpris baserat på maskin
  const [calculatedCreditPrice, setCalculatedCreditPrice] = useState<number>(0);
  
  // Uppdatera driftskostnad när maskin eller behandlingsdata ändras
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      // Använd maskinens fördefinierade creditMin värde
      const creditPrice = selectedMachine.creditMin || 149; // Säkerställ att vi använder 149 som standard
      setCalculatedCreditPrice(creditPrice);
      
      // Säkerställ att treatmentsPerDay och leasingCost är giltiga värden
      const safetreatmentsPerDay = isNaN(treatmentsPerDay) ? 0 : treatmentsPerDay;
      const safeLeasingCost = isNaN(leasingCost) ? 0 : leasingCost;
      
      // Beräkna om flatrate ska vara aktivt (över 80% av maximal leasing och minst 3 behandlingar/dag)
      const maxLeasingCost = selectedMachine.leasingMax || 0;
      const isFlatrateUnlocked = safeLeasingCost >= (maxLeasingCost * 0.8) && safetreatmentsPerDay >= 3;
      const useFlatrateForCalculation = useFlatrateOption === 'flatrate' && isFlatrateUnlocked;
      
      // Beräkna driftskostnad baserat på valt läge
      let monthlyOperatingCost = 0;
      
      if (useFlatrateForCalculation) {
        // Använd maskinens fasta flatrate-belopp
        monthlyOperatingCost = selectedMachine.flatrateAmount || 5996;
      } else {
        // Beräkna kostnad per månad baserat på credits
        const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
        monthlyOperatingCost = safetreatmentsPerDay * 22 * creditsPerTreatment * creditPrice;
      }
      
      setOperatingCost({
        costPerMonth: monthlyOperatingCost,
        useFlatrate: useFlatrateForCalculation
      });
    } else {
      // Återställ värdena om ingen maskin är vald eller om den valda maskinen inte använder credits
      setCalculatedCreditPrice(0);
      setOperatingCost({
        costPerMonth: 0,
        useFlatrate: false
      });
    }
  }, [selectedMachineId, leasingCost, selectedLeasingPeriodId, machinePriceSEK, treatmentsPerDay, useFlatrateOption, allowBelowFlatrate]);

  return { 
    operatingCost,
    calculatedCreditPrice
  };
}
