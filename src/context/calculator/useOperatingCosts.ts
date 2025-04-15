
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { FlatrateOption, SlaLevel, SLA_PRICES } from '@/utils/constants';
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
  leaseAdjustmentFactor = 1, // Adjustmentfaktor för att beräkna kreditpriset korrekt
  selectedSlaLevel = 'Brons', // SLA-nivå
  paymentOption = 'leasing' // Betalningsalternativ
}: {
  selectedMachineId: string;
  treatmentsPerDay: number;
  leasingCost: number;
  selectedLeasingPeriodId: string;
  machinePriceSEK: number;
  allowBelowFlatrate: boolean;
  useFlatrateOption?: FlatrateOption;
  leaseAdjustmentFactor?: number;
  selectedSlaLevel?: SlaLevel;
  paymentOption?: 'leasing' | 'cash';
}) {
  const [operatingCost, setOperatingCost] = useState<{ 
    costPerMonth: number, 
    useFlatrate: boolean,
    slaCost: number,
    totalCost: number
  }>({ 
    costPerMonth: 0, 
    useFlatrate: false,
    slaCost: 0,
    totalCost: 0
  });
  
  const [calculatedCreditPrice, setCalculatedCreditPrice] = useState<number>(0);
  
  const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
  
  useEffect(() => {
    if (!selectedMachine) {
      setOperatingCost({ 
        costPerMonth: 0, 
        useFlatrate: false,
        slaCost: 0,
        totalCost: 0
      });
      setCalculatedCreditPrice(0);
      return;
    }

    // Hämta SLA-kostnad från konstanter
    const slaCost = SLA_PRICES[selectedSlaLevel] || 0;

    let creditOrFlatrateCost = 0;
    
    if (selectedMachine.usesCredits) {
      let creditPrice: number = 0;
      
      // Beräkna kreditpris baserat på betalningsalternativ
      if (paymentOption === 'leasing') {
        // För leasing, använd trepunktsinterpolation
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
      } else {
        // För kontant, använd creditMin
        creditPrice = selectedMachine.creditMin || 149;
      }
      
      // Säkerställ att kreditpriset aldrig blir negativt
      creditPrice = Math.max(0, Math.round(creditPrice));
      setCalculatedCreditPrice(creditPrice);
      
      const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
      
      // Avgör om flatrate ska användas baserat på betalningsalternativ
      let shouldUseFlatrate = useFlatrateOption === 'flatrate';
      
      // För kontantalternativ, kräver vi bara minst 3 behandlingar per dag
      if (paymentOption === 'cash') {
        shouldUseFlatrate = shouldUseFlatrate && treatmentsPerDay >= 3;
      } else {
        // För leasing, kräver vi både minst 3 behandlingar och 80% av leasingMax
        const meetsLeasingRequirement = allowBelowFlatrate || (leasingCost >= selectedMachine.leasingMin * 0.8);
        shouldUseFlatrate = shouldUseFlatrate && treatmentsPerDay >= 3 && meetsLeasingRequirement;
      }
      
      if (shouldUseFlatrate && selectedMachine.flatrateAmount) {
        creditOrFlatrateCost = selectedMachine.flatrateAmount;
      } else {
        const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
        creditOrFlatrateCost = creditsPerTreatment * treatmentsPerMonth * creditPrice;
      }
      
      // Total driftskostnad = kredit/flatrate + SLA
      const totalCost = creditOrFlatrateCost + slaCost;
      
      setOperatingCost({
        costPerMonth: creditOrFlatrateCost,
        useFlatrate: shouldUseFlatrate,
        slaCost: slaCost,
        totalCost: totalCost
      });
      
      console.log(`Driftskostnad beräknad för ${selectedMachine.name}:
        Betalningsalternativ: ${paymentOption}
        Behandlingar per dag: ${treatmentsPerDay}
        Behandlingar per månad: ${treatmentsPerMonth}
        Kreditpris: ${creditPrice}
        Använder flatrate: ${shouldUseFlatrate}
        Kredit/Flatrate-kostnad: ${creditOrFlatrateCost} kr
        SLA-nivå: ${selectedSlaLevel}
        SLA-kostnad: ${slaCost} kr
        Total driftskostnad: ${totalCost} kr
      `);
    } else {
      // För maskiner utan credits är driftskostnaden bara SLA-kostnaden
      setOperatingCost({ 
        costPerMonth: 0, 
        useFlatrate: false,
        slaCost: slaCost,
        totalCost: slaCost
      });
      setCalculatedCreditPrice(0);
      
      console.log(`Driftskostnad beräknad för ${selectedMachine.name} (utan credits):
        SLA-nivå: ${selectedSlaLevel}
        SLA-kostnad: ${slaCost} kr
        Total driftskostnad: ${slaCost} kr
      `);
    }
  }, [selectedMachine, treatmentsPerDay, useFlatrateOption, leaseAdjustmentFactor, leasingCost, selectedSlaLevel, paymentOption, allowBelowFlatrate]);

  return { 
    operatingCost,
    calculatedCreditPrice
  };
}
