
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { FlatrateOption } from '@/utils/constants';
import { calculateCreditPrice } from '@/utils/creditUtils';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';

export function useOperatingCosts({
  selectedMachineId,
  treatmentsPerDay,
  leasingCost,
  selectedLeasingPeriodId,
  machinePriceSEK,
  allowBelowFlatrate,
  useFlatrateOption = 'perCredit',
  leaseAdjustmentFactor = 1 // Adjustmentfaktor för att beräkna kreditpriset korrekt
}: {
  selectedMachineId: string;
  treatmentsPerDay: number;
  leasingCost: number;
  selectedLeasingPeriodId: string;
  machinePriceSEK: number;
  allowBelowFlatrate: boolean;
  useFlatrateOption?: FlatrateOption;
  leaseAdjustmentFactor?: number;
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
      let creditPrice: number = 0;
      
      // Implementera korrekt interpolation för kreditpris
      if (selectedMachine.creditMin && selectedMachine.creditMax && 
          selectedMachine.leasingMin && selectedMachine.leasingMax) {
        
        // Beräkna gamla leasingMax (mittpunkten i nya skalan)
        const oldLeasingMax = (selectedMachine.leasingMin + selectedMachine.leasingMax) / 2;
        
        // Avancerad interpolation baserad på leasingCost
        if (leasingCost <= oldLeasingMax) {
          // Mellan leasingMin och oldLeasingMax: Linjär interpolation från creditMax till creditMin
          const factor = (leasingCost - selectedMachine.leasingMin) / (oldLeasingMax - selectedMachine.leasingMin);
          creditPrice = selectedMachine.creditMax - factor * (selectedMachine.creditMax - selectedMachine.creditMin);
        } else {
          // Mellan oldLeasingMax och leasingMax: Linjär interpolation från creditMin till 0
          const factor = (leasingCost - oldLeasingMax) / (selectedMachine.leasingMax - oldLeasingMax);
          creditPrice = selectedMachine.creditMin * (1 - factor);
        }
        
        console.log(`Kreditpris interpolation för ${selectedMachine.name}:
          LeasingCost: ${leasingCost}
          LeasingMin: ${selectedMachine.leasingMin}
          OldLeasingMax (mittpunkt): ${oldLeasingMax}
          LeasingMax: ${selectedMachine.leasingMax}
          CreditMin: ${selectedMachine.creditMin}
          CreditMax: ${selectedMachine.creditMax}
          Interpolerat kreditpris: ${creditPrice}
        `);
      } else {
        // Fallback om maskinspecifika värden saknas
        creditPrice = 149;
      }
      
      // Avrunda kreditpriset
      creditPrice = Math.round(creditPrice);
      setCalculatedCreditPrice(creditPrice);
      
      // Beräkna antalet behandlingar per månad
      const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH; // 22 arbetsdagar per månad
      
      // Avgör om vi ska använda flatrate baserat på användarens val
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
  }, [selectedMachine, treatmentsPerDay, useFlatrateOption, leaseAdjustmentFactor, leasingCost]);

  return { 
    operatingCost,
    calculatedCreditPrice
  };
}
