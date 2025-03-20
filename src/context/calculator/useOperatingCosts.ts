
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
  useFlatrateOption = false
}: {
  selectedMachineId: string;
  treatmentsPerDay: number;
  leasingCost: number;
  selectedLeasingPeriodId: string;
  machinePriceSEK: number;
  allowBelowFlatrate: boolean;
  useFlatrateOption?: boolean;
}) {
  const [operatingCost, setOperatingCost] = useState<{ costPerMonth: number, useFlatrate: boolean }>({ 
    costPerMonth: 0, 
    useFlatrate: false 
  });
  
  // Calculate the appropriate credit price based on leasing cost for the current machine
  const [calculatedCreditPrice, setCalculatedCreditPrice] = useState<number>(0);
  
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      // Uppdatera kreditpriset på en gång när leasingkostnaden ändras
      const newCreditPrice = calculateCreditPrice(
        selectedMachine, 
        leasingCost,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      setCalculatedCreditPrice(newCreditPrice);
      console.log(`Beräknat credit-pris baserat på leasingkostnad ${leasingCost} → ${newCreditPrice}`);
      
      // Recalculate operating cost immediately
      const shouldUseFlatrateOption = shouldUseFlatrate(
        selectedMachine,
        leasingCost,
        treatmentsPerDay,
        allowBelowFlatrate,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      // Använd explicit flatrate-val från användaren om det är tillgängligt
      const isFlatrateUnlocked = leasingCost >= (selectedMachine.leasingMax * 0.8) && treatmentsPerDay >= 3;
      const useFlatrateForCalculation = useFlatrateOption && isFlatrateUnlocked;
      
      // Beräkna driftkostnad med nytt kreditpris
      const calculatedOperatingCost = calculateOperatingCost(
        selectedMachine,
        treatmentsPerDay,
        newCreditPrice,
        leasingCost,
        !useFlatrateForCalculation,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      setOperatingCost({
        costPerMonth: calculatedOperatingCost.costPerMonth,
        useFlatrate: useFlatrateForCalculation
      });
    }
  }, [selectedMachineId, leasingCost, selectedLeasingPeriodId, machinePriceSEK]);

  // Then calculate the operating cost based on the treatments, etc.
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine) {
      // Get current calculated credit price
      const currentCreditPrice = calculatedCreditPrice > 0 ? 
        calculatedCreditPrice : 
        calculateCreditPrice(
          selectedMachine, 
          leasingCost,
          selectedLeasingPeriodId,
          machinePriceSEK
        );
      
      // Kolla om flatrate skulle användas baserat på regler
      const shouldUseFlatrateOption = shouldUseFlatrate(
        selectedMachine,
        leasingCost,
        treatmentsPerDay,
        allowBelowFlatrate,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      // Använd explicit flatrate-val från användaren om det är tillgängligt
      // Flatrate kan bara väljas om villkoren uppfylls (leasingCost >= 80% och treatmentsPerDay >= 3)
      const isFlatrateUnlocked = leasingCost >= (selectedMachine.leasingMax * 0.8) && treatmentsPerDay >= 3;
      const useFlatrateForCalculation = useFlatrateOption && isFlatrateUnlocked;
      
      console.log(`Operating cost beräkning:
        useFlatrateOption (användarval): ${useFlatrateOption}
        isFlatrateUnlocked: ${isFlatrateUnlocked}
        Kreditpris: ${currentCreditPrice}
        Slutligt useFlatrateForCalculation: ${useFlatrateForCalculation}
      `);
      
      // Beräkna driftkostnad (antingen credits eller flatrate)
      const calculatedOperatingCost = calculateOperatingCost(
        selectedMachine,
        treatmentsPerDay,
        currentCreditPrice,
        leasingCost,
        !useFlatrateForCalculation, // Invertera för att följa tidigare logik
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      console.log(`Beräknad driftkostnad per månad: ${calculatedOperatingCost.costPerMonth} kr (med kreditpris: ${currentCreditPrice})`);
      
      setOperatingCost({
        costPerMonth: calculatedOperatingCost.costPerMonth,
        useFlatrate: useFlatrateForCalculation // Använd användarens explicita val
      });
    }
  }, [selectedMachineId, treatmentsPerDay, leasingCost, machinePriceSEK, selectedLeasingPeriodId, allowBelowFlatrate, useFlatrateOption, calculatedCreditPrice]);

  return { 
    operatingCost,
    calculatedCreditPrice
  };
}
