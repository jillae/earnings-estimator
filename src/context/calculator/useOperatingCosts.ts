
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { 
  calculateOperatingCost,
  shouldUseFlatrate
} from '@/utils/calculatorUtils';

export function useOperatingCosts({
  selectedMachineId,
  treatmentsPerDay,
  creditPrice,
  leasingCost,
  selectedLeasingPeriodId,
  machinePriceSEK
}: {
  selectedMachineId: string;
  treatmentsPerDay: number;
  creditPrice: number;
  leasingCost: number;
  selectedLeasingPeriodId: string;
  machinePriceSEK: number;
}) {
  const [operatingCost, setOperatingCost] = useState<{ costPerMonth: number, useFlatrate: boolean }>({ 
    costPerMonth: 0, 
    useFlatrate: false 
  });

  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine) {
      // Check if we need to use flatrate based on leasing cost and treatments per day
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
        creditPrice,
        leasingCost,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      setOperatingCost(calculatedOperatingCost);
    }
  }, [selectedMachineId, treatmentsPerDay, creditPrice, leasingCost, machinePriceSEK, selectedLeasingPeriodId]);

  return { operatingCost };
}
