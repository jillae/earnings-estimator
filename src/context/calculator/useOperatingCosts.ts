
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { calculateCreditPrice, calculateOperatingCost } from '@/utils/creditUtils';
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
      // Hämta kreditprisintervall från maskinen
      const creditMin = selectedMachine.creditMin || 140;
      const creditMax = selectedMachine.creditMax || 290;
      
      // Beräkna position inom leasingintervallet (0-1)
      const leasingMin = selectedMachine.leasingMin || 0;
      const leasingMax = selectedMachine.leasingMax || 0;
      const leasingRange = leasingMax - leasingMin;
      
      // Invertera positionen (högt leasing = lågt kreditpris)
      let position = 0;
      if (leasingRange > 0) {
        position = 1 - ((leasingCost - leasingMin) / leasingRange);
      }
      
      // Beräkna dynamiskt kreditpris baserat på position
      const creditRange = creditMax - creditMin;
      const dynamicCreditPrice = creditMin + (position * creditRange);
      
      console.log(`Beräknar kreditpris för ${selectedMachine.name}:
        Leasing position: ${position * 100}%
        Kreditprisintervall: ${creditMin} - ${creditMax}
        Dynamiskt kreditpris: ${dynamicCreditPrice}
      `);
      
      setCalculatedCreditPrice(dynamicCreditPrice);
      
      // Säkerställ att treatmentsPerDay och leasingCost är giltiga värden
      const safetreatmentsPerDay = isNaN(treatmentsPerDay) ? 0 : treatmentsPerDay;
      const safeLeasingCost = isNaN(leasingCost) ? 0 : leasingCost;
      
      // Beräkna om flatrate ska användas baserat på användarens val
      const useFlatrate = useFlatrateOption === 'flatrate';
      
      // Beräkna månadskostand
      const cost = calculateOperatingCost(
        selectedMachine,
        safetreatmentsPerDay,
        dynamicCreditPrice,
        safeLeasingCost,
        useFlatrate,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      setOperatingCost(cost);
      
      console.log(`Operating cost calculated: 
        Credit price: ${dynamicCreditPrice}
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
