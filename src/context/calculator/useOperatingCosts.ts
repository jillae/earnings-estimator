
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
  
  // Beräkna kreditpris och uppdatera driftskostnad när leasingkostnaden ändras
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      // Beräkna ett nytt kreditpris baserat på den aktuella leasingkostnaden
      const newCreditPrice = calculateCreditPrice(
        selectedMachine, 
        leasingCost,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      setCalculatedCreditPrice(newCreditPrice);
      console.log(`Beräknat credit-pris baserat på leasingkostnad ${leasingCost} → ${newCreditPrice}`);
      
      // Beräkna om operating cost direkt för att undvika fördröjning
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
  }, [selectedMachineId, leasingCost, selectedLeasingPeriodId, machinePriceSEK, treatmentsPerDay, useFlatrateOption]);

  // Uppdatera driftkostnaden när antal behandlingar ändras
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && calculatedCreditPrice > 0) {
      // Kolla om flatrate skulle användas baserat på regler
      const isFlatrateUnlocked = leasingCost >= (selectedMachine.leasingMax * 0.8) && treatmentsPerDay >= 3;
      const useFlatrateForCalculation = useFlatrateOption && isFlatrateUnlocked;
      
      console.log(`Operating cost beräkning:
        useFlatrateOption (användarval): ${useFlatrateOption}
        isFlatrateUnlocked: ${isFlatrateUnlocked}
        Kreditpris: ${calculatedCreditPrice}
        Slutligt useFlatrateForCalculation: ${useFlatrateForCalculation}
      `);
      
      // Beräkna driftkostnad (antingen credits eller flatrate)
      const calculatedOperatingCost = calculateOperatingCost(
        selectedMachine,
        treatmentsPerDay,
        calculatedCreditPrice,
        leasingCost,
        !useFlatrateForCalculation,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      console.log(`Beräknad driftkostnad per månad: ${calculatedOperatingCost.costPerMonth} kr (med kreditpris: ${calculatedCreditPrice})`);
      
      setOperatingCost({
        costPerMonth: calculatedOperatingCost.costPerMonth,
        useFlatrate: useFlatrateForCalculation
      });
    }
  }, [treatmentsPerDay, useFlatrateOption, calculatedCreditPrice, selectedMachineId, leasingCost, selectedLeasingPeriodId, machinePriceSEK]);

  return { 
    operatingCost,
    calculatedCreditPrice
  };
}
