
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { calculateCreditPrice, calculateOperatingCost } from '@/utils/creditUtils';

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
      // Beräkna kreditpris baserat på maskin och leasingkostnad
      const creditPrice = calculateCreditPrice(
        selectedMachine,
        leasingCost,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      setCalculatedCreditPrice(creditPrice);
      
      // Säkerställ att treatmentsPerDay och leasingCost är giltiga värden
      const safetreatmentsPerDay = isNaN(treatmentsPerDay) ? 0 : treatmentsPerDay;
      const safeLeasingCost = isNaN(leasingCost) ? 0 : leasingCost;
      
      // Beräkna om flatrate ska användas baserat på användarens val
      const usePerCreditModel = useFlatrateOption === 'perCredit';
      
      // Beräkna månadskostand
      const cost = calculateOperatingCost(
        selectedMachine,
        safetreatmentsPerDay,
        creditPrice,
        safeLeasingCost,
        !usePerCreditModel,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      setOperatingCost(cost);
      
      console.log(`Operating cost calculated: 
        Credit price: ${creditPrice}
        Per credit model: ${usePerCreditModel}
        Cost per month: ${cost.costPerMonth}
        Uses flatrate: ${cost.useFlatrate}
      `);
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
