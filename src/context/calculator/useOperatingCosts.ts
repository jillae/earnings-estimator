
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { calculateCreditPrice, calculateOperatingCost, shouldUseFlatrate } from '@/utils/creditUtils';
import { FlatrateOption } from '@/utils/constants';

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
  useFlatrateOption?: FlatrateOption;
}) {
  const [operatingCost, setOperatingCost] = useState<{ costPerMonth: number, useFlatrate: boolean }>({ 
    costPerMonth: 0, 
    useFlatrate: false 
  });
  
  // Beräkna och spara kreditpris baserat på maskin och leasingkostnad
  const [calculatedCreditPrice, setCalculatedCreditPrice] = useState<number>(0);
  
  // Hämta vald maskin
  const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
  
  // Uppdatera driftskostnad när maskin eller behandlingsdata ändras
  useEffect(() => {
    if (selectedMachine && selectedMachine.usesCredits) {
      // Beräkna kreditpris med linjär interpolation baserat på leasingkostnad
      const creditPrice = calculateCreditPrice(
        selectedMachine,
        leasingCost,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      console.log(`Beräknat kreditpris för ${selectedMachine.name}: ${creditPrice} kr baserat på leasingkostnad ${leasingCost} kr`);
      setCalculatedCreditPrice(creditPrice);
      
      // Säkerställ att treatmentsPerDay och leasingCost är giltiga värden
      const safetreatmentsPerDay = isNaN(treatmentsPerDay) ? 0 : treatmentsPerDay;
      const safeLeasingCost = isNaN(leasingCost) ? 0 : leasingCost;
      
      // Kontrollera om flatrate kan användas baserat på regler
      const canUseFlatrate = shouldUseFlatrate(
        selectedMachine,
        safeLeasingCost,
        safetreatmentsPerDay,
        allowBelowFlatrate,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      // Använd flatrate om användaren valt det OCH flatrate får användas
      let useFlatrate = useFlatrateOption === 'flatrate' && canUseFlatrate;
      
      console.log(`Flatrate status för ${selectedMachine.name}:
        canUseFlatrate: ${canUseFlatrate}
        useFlatrateOption: ${useFlatrateOption}
        final useFlatrate: ${useFlatrate}
      `);
      
      // Beräkna månadskostnad
      const cost = calculateOperatingCost(
        selectedMachine,
        safetreatmentsPerDay,
        creditPrice,
        safeLeasingCost,
        useFlatrate,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      setOperatingCost(cost);
      
      console.log(`Operating cost calculated: 
        Credit price: ${creditPrice}
        Per credit model: ${useFlatrateOption === 'perCredit'}
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
  }, [selectedMachine, leasingCost, selectedLeasingPeriodId, machinePriceSEK, treatmentsPerDay, useFlatrateOption, allowBelowFlatrate]);

  return { 
    operatingCost,
    calculatedCreditPrice
  };
}
