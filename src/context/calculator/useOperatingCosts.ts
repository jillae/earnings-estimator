
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
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
    if (!selectedMachine) {
      setOperatingCost({ costPerMonth: 0, useFlatrate: false });
      setCalculatedCreditPrice(0);
      return;
    }

    // Om maskinen använder krediter, beräkna driftskostnad
    if (selectedMachine.usesCredits) {
      // För enkelheten i denna implementation, använd ett fast kreditpris
      const creditPrice = selectedMachine.creditMin || 149;
      setCalculatedCreditPrice(creditPrice);
      
      // Beräkna antalet behandlingar per månad
      const treatmentsPerMonth = treatmentsPerDay * 22; // 22 arbetsdagar per månad
      
      // Avgör om vi ska använda flatrate baserat på användarens val
      // I en verklig implementation skulle vi ha mer komplexa regler här
      const shouldUseFlatrate = useFlatrateOption === 'flatrate';
      
      let monthlyCost = 0;
      
      if (shouldUseFlatrate && selectedMachine.flatrateAmount) {
        // Använd flatrate
        monthlyCost = selectedMachine.flatrateAmount;
      } else {
        // Använd per-credit kostnad
        const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
        monthlyCost = creditsPerTreatment * treatmentsPerMonth * creditPrice;
      }
      
      setOperatingCost({
        costPerMonth: monthlyCost,
        useFlatrate: shouldUseFlatrate
      });
      
      console.log(`Driftskostnad beräknad för ${selectedMachine.name}:
        Behandlingar per dag: ${treatmentsPerDay}
        Behandlingar per månad: ${treatmentsPerMonth}
        Kreditpris: ${creditPrice}
        Använder flatrate: ${shouldUseFlatrate}
        Månadskostnad: ${monthlyCost} kr
      `);
    } else {
      // Om maskinen inte använder krediter, sätt kostnad till 0
      setOperatingCost({ costPerMonth: 0, useFlatrate: false });
      setCalculatedCreditPrice(0);
    }
  }, [selectedMachine, treatmentsPerDay, useFlatrateOption]);

  return { 
    operatingCost,
    calculatedCreditPrice
  };
}
