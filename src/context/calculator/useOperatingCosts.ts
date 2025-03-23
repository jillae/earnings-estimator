
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
  
  // Beräkna och spara kreditpris baserat på maskin, nu använder vi maskinens creditMin direkt
  const [calculatedCreditPrice, setCalculatedCreditPrice] = useState<number>(0);
  
  // Hämta vald maskin
  const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
  
  // Uppdatera driftskostnad när maskin eller behandlingsdata ändras
  useEffect(() => {
    if (selectedMachine && selectedMachine.usesCredits) {
      // Använda maskinens creditMin direkt
      const creditPrice = selectedMachine.creditMin || 149;
      
      console.log(`Använder kreditpris för ${selectedMachine.name}: ${creditPrice} kr (direkt från maskindata)`);
      setCalculatedCreditPrice(creditPrice);
      
      // Säkerställ att treatmentsPerDay och leasingCost är giltiga värden
      const safetreatmentsPerDay = isNaN(treatmentsPerDay) ? 0 : treatmentsPerDay;
      const safeLeasingCost = isNaN(leasingCost) ? 0 : leasingCost;
      
      // Beräkna om flatrate ska användas baserat på användarens val
      // Men bara om vi är över tröskeln (80%) och har minst 3 behandlingar per dag
      let useFlatrate = useFlatrateOption === 'flatrate';
      
      // Om vi har valt flatrate men är under tröskeln eller har för få behandlingar, inaktivera det
      if (useFlatrate) {
        // Beräkna tröskelvärdet (80% av max leasing)
        const flatrateThreshold = selectedMachine.leasingMax ? selectedMachine.leasingMax * 0.8 : 0;
        
        if (safeLeasingCost < flatrateThreshold || safetreatmentsPerDay < 3) {
          console.log('Flatrate begärd men är under tröskeln eller för få behandlingar, inaktiverar flatrate');
          useFlatrate = false;
        }
      }
      
      // Beräkna månadskostand
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
