
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { 
  calculateOperatingCost,
  shouldUseFlatrate,
  calculateCreditPrice
} from '@/utils/calculatorUtils';

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
  
  // Calculate the appropriate credit price based on the current machine
  const [calculatedCreditPrice, setCalculatedCreditPrice] = useState<number>(0);
  
  // Beräkna kreditpris och uppdatera driftskostnad när maskin eller leasing ändras
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      // Använd korrekt credit-min värde från maskin-objektet
      const creditPrice = selectedMachine.creditMin || 0;
      setCalculatedCreditPrice(creditPrice);
      
      console.log(`Använder fördefinierat credit-värde för ${selectedMachine.name}: ${creditPrice}`);
      
      // Beräkna om operating cost direkt för att undvika fördröjning
      const isFlatrateUnlocked = leasingCost >= (selectedMachine.leasingMax * 0.8) && treatmentsPerDay >= 3;
      const useFlatrateForCalculation = useFlatrateOption === 'flatrate' && isFlatrateUnlocked;
      
      // Använd maskiens flatrateAmount direkt - inte beräknad
      const flatrateAmount = selectedMachine.flatrateAmount;
      
      // Beräkna driftkostnad
      const monthlyOperatingCost = useFlatrateForCalculation 
        ? flatrateAmount 
        : (treatmentsPerDay * 22 * creditPrice); // 22 arbetsdagar per månad
      
      setOperatingCost({
        costPerMonth: monthlyOperatingCost,
        useFlatrate: useFlatrateForCalculation
      });
      
      console.log(`Beräknad driftkostnad för ${selectedMachine.name}: 
        Använder flatrate: ${useFlatrateForCalculation}
        Flatrate belopp: ${flatrateAmount}
        Credits per behandling: ${selectedMachine.creditsPerTreatment || 1}
        Credit pris: ${creditPrice}
        Behandlingar per dag: ${treatmentsPerDay}
        Månadskostnad: ${monthlyOperatingCost}`);
    }
  }, [selectedMachineId, leasingCost, selectedLeasingPeriodId, machinePriceSEK, treatmentsPerDay, useFlatrateOption]);

  return { 
    operatingCost,
    calculatedCreditPrice
  };
}
