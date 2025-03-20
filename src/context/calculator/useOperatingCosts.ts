
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
  machinePriceSEK
}: {
  selectedMachineId: string;
  treatmentsPerDay: number;
  leasingCost: number;
  selectedLeasingPeriodId: string;
  machinePriceSEK: number;
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
      // Check if we need to use flatrate based on leasing cost and treatments per day
      // The key rule is: treatmentsPerDay >= 3 AND leasingCost > 80% of leasingMax
      const useFlatrateOption = shouldUseFlatrate(
        selectedMachine,
        leasingCost,
        treatmentsPerDay,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      console.log(`Using flatrate: ${useFlatrateOption} (leasingCost: ${leasingCost}, treatmentsPerDay: ${treatmentsPerDay})`);
      
      // Calculate operating cost (either credits or flatrate)
      const calculatedOperatingCost = calculateOperatingCost(
        selectedMachine,
        treatmentsPerDay,
        calculatedCreditPrice, // Use the calculated credit price
        leasingCost,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      setOperatingCost(calculatedOperatingCost);
    }
  }, [selectedMachineId, treatmentsPerDay, calculatedCreditPrice, leasingCost, machinePriceSEK, selectedLeasingPeriodId]);

  return { 
    operatingCost,
    calculatedCreditPrice // Return the calculated credit price for display purposes
  };
}
