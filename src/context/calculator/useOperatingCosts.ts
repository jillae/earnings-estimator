
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
  
  // First, calculate the credit price based on current leasing cost
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      const newCreditPrice = calculateCreditPrice(
        selectedMachine, 
        leasingCost,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      setCalculatedCreditPrice(newCreditPrice);
      console.log(`Calculated credit price based on leasing cost: ${leasingCost} → ${newCreditPrice}`);
    }
  }, [selectedMachineId, leasingCost, selectedLeasingPeriodId, machinePriceSEK]);

  // Then calculate the operating cost based on the treatments, etc.
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine) {
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
      
      console.log(`Operating cost calculation:
        useFlatrateOption (user choice): ${useFlatrateOption}
        isFlatrateUnlocked: ${isFlatrateUnlocked}
        Final useFlatrateForCalculation: ${useFlatrateForCalculation}
      `);
      
      // Beräkna driftkostnad (antingen credits eller flatrate)
      const calculatedOperatingCost = calculateOperatingCost(
        selectedMachine,
        treatmentsPerDay,
        calculatedCreditPrice,
        leasingCost,
        !useFlatrateForCalculation, // Invertera för att följa tidigare logik
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      setOperatingCost({
        ...calculatedOperatingCost,
        useFlatrate: useFlatrateForCalculation // Använd användarens explicita val
      });
    }
  }, [selectedMachineId, treatmentsPerDay, calculatedCreditPrice, leasingCost, machinePriceSEK, selectedLeasingPeriodId, allowBelowFlatrate, useFlatrateOption]);

  return { 
    operatingCost,
    calculatedCreditPrice // Return the calculated credit price for display purposes
  };
}
