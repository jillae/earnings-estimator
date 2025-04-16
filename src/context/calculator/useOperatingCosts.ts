
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { FlatrateOption, SlaLevel } from '@/utils/constants';
import { calculateCreditPrice } from '@/utils/credits/creditPricing';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';
import { calculateSlaCost } from '@/utils/pricingUtils';

export function useOperatingCosts({
  selectedMachineId,
  treatmentsPerDay,
  leasingCost,
  selectedLeasingPeriodId,
  machinePriceSEK,
  allowBelowFlatrate,
  useFlatrateOption = 'perCredit',
  leaseAdjustmentFactor = 0.5,
  selectedSlaLevel = 'Brons',
  paymentOption = 'leasing',
  leasingMax60mRef = 0
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
  leasingMax60mRef?: number;
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

    // Beräkna SLA-kostnad baserat på vald nivå och referensvärde
    const slaCost = calculateSlaCost(selectedMachine, selectedSlaLevel, leasingMax60mRef);

    let creditOrFlatrateCost = 0;
    
    // Om maskinen använder credits OCH vi är på Brons-nivå, beräkna credit/flatrate-kostnad
    if (selectedMachine.usesCredits && selectedSlaLevel === 'Brons') {
      // Beräkna kreditpris baserat på betalningsalternativ och leasingkostnad
      const creditPrice = calculateCreditPrice(
        selectedMachine, 
        leasingCost, 
        paymentOption, 
        selectedLeasingPeriodId, 
        machinePriceSEK
      );
      
      // Säkerställ att kreditpriset aldrig blir negativt
      const safeCreditPrice = Math.max(0, Math.round(creditPrice));
      setCalculatedCreditPrice(safeCreditPrice);
      
      const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
      
      // Avgör om flatrate ska användas baserat på betalningsalternativ
      let shouldUseFlatrate = useFlatrateOption === 'flatrate';
      
      // För kontantalternativ, kräver vi bara minst 3 behandlingar per dag
      if (paymentOption === 'cash') {
        shouldUseFlatrate = shouldUseFlatrate && treatmentsPerDay >= 3;
      } else {
        // För leasing, kräver vi både minst 3 behandlingar och 80% av leasingMin
        const meetsLeasingRequirement = allowBelowFlatrate || (selectedMachine.leasingMin && leasingCost >= selectedMachine.leasingMin * 0.8);
        shouldUseFlatrate = shouldUseFlatrate && treatmentsPerDay >= 3 && meetsLeasingRequirement;
      }
      
      if (shouldUseFlatrate && selectedMachine.flatrateAmount) {
        creditOrFlatrateCost = selectedMachine.flatrateAmount;
      } else {
        const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
        creditOrFlatrateCost = creditsPerTreatment * treatmentsPerMonth * safeCreditPrice;
      }
      
      // För Brons SLA, totalCost = creditOrFlatrateCost (eftersom slaCost = 0)
      setOperatingCost({
        costPerMonth: creditOrFlatrateCost,
        useFlatrate: shouldUseFlatrate,
        slaCost: slaCost,
        totalCost: creditOrFlatrateCost
      });
    } else {
      // För maskiner utan credits ELLER Silver/Guld SLA, 
      // är driftskostnaden bara SLA-kostnaden (som inkluderar Flatrate för Silver/Guld)
      setOperatingCost({ 
        costPerMonth: 0, 
        useFlatrate: false,
        slaCost: slaCost,
        totalCost: slaCost
      });
      
      // För maskiner utan credits eller nivåer med Flatrate ingår (Silver/Guld), 
      // behåll kreditpriset som beräknats ovan om det finns
      if (!selectedMachine.usesCredits || selectedSlaLevel !== 'Brons') {
        setCalculatedCreditPrice(0);
      } else {
        // För Brons, använd det beräknade kreditpriset
        const creditPrice = calculateCreditPrice(
          selectedMachine, 
          leasingCost, 
          paymentOption, 
          selectedLeasingPeriodId, 
          machinePriceSEK
        );
        setCalculatedCreditPrice(Math.max(0, Math.round(creditPrice)));
      }
    }
    
    console.log(`Driftskostnad beräknad för ${selectedMachine.name}:
      Betalningsalternativ: ${paymentOption}
      SLA-nivå: ${selectedSlaLevel}
      leasingMax60mRef: ${leasingMax60mRef}
      SLA-kostnad: ${slaCost} kr
      Behandlingar per dag: ${treatmentsPerDay}
      Credit/Flatrate-kostnad (om Brons): ${creditOrFlatrateCost} kr
      Total driftskostnad: ${operatingCost.totalCost} kr
      Kreditpris: ${calculatedCreditPrice} kr
    `);
  }, [
    selectedMachine, 
    treatmentsPerDay, 
    useFlatrateOption, 
    leasingCost, 
    selectedLeasingPeriodId,
    selectedSlaLevel, 
    paymentOption, 
    allowBelowFlatrate, 
    leasingMax60mRef,
    machinePriceSEK
  ]);

  return { 
    operatingCost,
    calculatedCreditPrice
  };
}
