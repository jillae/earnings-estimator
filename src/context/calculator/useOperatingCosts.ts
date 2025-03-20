
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { 
  calculateCreditPrice, 
  calculateOperatingCost, 
  shouldUseFlatrate 
} from '@/utils/calculatorUtils';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';

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
  const [calculatedCreditPrice, setCalculatedCreditPrice] = useState<number>(0);
  const [useFlatrate, setUseFlatrate] = useState<boolean>(false);
  const [operatingCost, setOperatingCost] = useState<{
    costPerTreatment: number;
    creditsPerMonth: number;
    costPerMonth: number;
    flatrateAmount: number;
    useFlatrate: boolean;
  }>({
    costPerTreatment: 0,
    creditsPerMonth: 0,
    costPerMonth: 0,
    flatrateAmount: 0,
    useFlatrate: false
  });

  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    if (!selectedMachine) return;

    const usesCredits = selectedMachine.usesCredits;
    
    if (!usesCredits) {
      setOperatingCost({
        costPerTreatment: 0,
        creditsPerMonth: 0,
        costPerMonth: 0,
        flatrateAmount: 0,
        useFlatrate: false
      });
      return;
    }

    // Calculate credit price
    const creditPrice = calculateCreditPrice(machinePriceSEK, selectedMachine.creditPriceMultiplier);
    setCalculatedCreditPrice(creditPrice);
    
    // Calculate flatrate threshold (80% of max leasing)
    const flatrateThreshold = machinePriceSEK * 0.8 * (selectedMachine.maxLeaseMultiplier || 0);
    
    // Determine if we should use flatrate based on leasing cost and treatments per day
    const shouldUseFlat = shouldUseFlatrate(leasingCost, flatrateThreshold, treatmentsPerDay);
    setUseFlatrate(shouldUseFlat);
    
    // Calculate credits per treatment and per month
    const creditsPerTreatment = 1;
    const creditsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH * creditsPerTreatment;
    
    // Calculate monthly operating cost
    const monthlyCost = calculateOperatingCost(
      treatmentsPerDay,
      WORKING_DAYS_PER_MONTH,
      creditPrice,
      selectedMachine.flatrateAmount,
      shouldUseFlat
    );
    
    setOperatingCost({
      costPerTreatment: creditPrice,
      creditsPerMonth,
      costPerMonth: monthlyCost,
      flatrateAmount: selectedMachine.flatrateAmount,
      useFlatrate: shouldUseFlat
    });

    console.log("Operating costs updated:", {
      creditPrice,
      treatmentsPerDay,
      monthlyCost,
      shouldUseFlat,
      flatrateThreshold,
      leasingCost
    });
    
  }, [selectedMachineId, treatmentsPerDay, leasingCost, selectedLeasingPeriodId, machinePriceSEK]);

  return {
    operatingCost,
    calculatedCreditPrice,
    useFlatrate
  };
}
