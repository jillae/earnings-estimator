
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
  
  const [calculatedCreditPrice, setCalculatedCreditPrice] = useState<number>(0);
  
  const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
  
  useEffect(() => {
    if (!selectedMachine) {
      setOperatingCost({ costPerMonth: 0, useFlatrate: false });
      setCalculatedCreditPrice(0);
      return;
    }

    if (selectedMachine.usesCredits) {
      let creditPrice: number = 0;
      
      if (selectedMachine.creditMin && selectedMachine.creditMax && 
          selectedMachine.leasingMin && selectedMachine.leasingMax) {
        
        const oldLeasingMax = (selectedMachine.leasingMin + selectedMachine.leasingMax) / 2;
        
        if (leasingCost <= oldLeasingMax) {
          const factor = (leasingCost - selectedMachine.leasingMin) / (oldLeasingMax - selectedMachine.leasingMin);
          creditPrice = selectedMachine.creditMax - factor * (selectedMachine.creditMax - selectedMachine.creditMin);
        } else {
          const factor = (leasingCost - oldLeasingMax) / (selectedMachine.leasingMax - oldLeasingMax);
          creditPrice = Math.max(0, selectedMachine.creditMin * (1 - factor));
        }
      } else {
        creditPrice = 149;
      }
      
      // Säkerställ att kreditpriset aldrig blir negativt
      creditPrice = Math.max(0, Math.round(creditPrice));
      setCalculatedCreditPrice(creditPrice);
      
      const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
      
      const shouldUseFlatrate = useFlatrateOption === 'flatrate';
      
      let monthlyCost = 0;
      
      if (shouldUseFlatrate && selectedMachine.flatrateAmount) {
        monthlyCost = selectedMachine.flatrateAmount;
      } else {
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
      setOperatingCost({ costPerMonth: 0, useFlatrate: false });
      setCalculatedCreditPrice(0);
    }
  }, [selectedMachine, treatmentsPerDay, useFlatrateOption, leaseAdjustmentFactor, leasingCost]);

  return { 
    operatingCost,
    calculatedCreditPrice
  };
}
