
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { FlatrateOption, SlaLevel } from '@/utils/constants';
import { calculateCreditPrice } from '@/utils/credits/creditPricing';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';
import { calculateSlaCost } from '@/utils/pricingUtils';
import { DriftpaketType } from '@/types/calculator';

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
  selectedDriftpaket = 'Bas',
  paymentOption = 'leasing',
  leasingMax60mRef = 0,
  creditPrice = 0
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
  selectedDriftpaket?: DriftpaketType;
  paymentOption?: 'leasing' | 'cash';
  leasingMax60mRef?: number;
  creditPrice?: number;
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
  const [calculatedSlaCostSilver, setCalculatedSlaCostSilver] = useState<number>(0);
  const [calculatedSlaCostGuld, setCalculatedSlaCostGuld] = useState<number>(0);
  
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
      setCalculatedSlaCostSilver(0);
      setCalculatedSlaCostGuld(0);
      return;
    }

    // Beräkna SLA-kostnad för alla nivåer
    const bronsCost = calculateSlaCost(selectedMachine, 'Brons', leasingMax60mRef);
    const silverCost = calculateSlaCost(selectedMachine, 'Silver', leasingMax60mRef);
    const guldCost = calculateSlaCost(selectedMachine, 'Guld', leasingMax60mRef);
    
    setCalculatedSlaCostSilver(silverCost);
    setCalculatedSlaCostGuld(guldCost);

    let creditOrFlatrateCost = 0;
    let shouldUseFlatrate = false;
    
    // Beräkna kreditpris och kredit/flatrate-kostnad för Bas-paketet
    if (selectedMachine.usesCredits && selectedDriftpaket === 'Bas') {
      // Använd det tillhandahållna kreditpriset, eller beräkna om det inte finns
      const effectiveCreditPrice = creditPrice || calculateCreditPrice(
        selectedMachine, 
        leasingCost, 
        paymentOption, 
        selectedLeasingPeriodId, 
        machinePriceSEK
      );
      
      // Säkerställ att kreditpriset aldrig blir negativt
      const safeCreditPrice = Math.max(0, Math.round(effectiveCreditPrice));
      setCalculatedCreditPrice(safeCreditPrice);
      
      const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
      
      // Avgör om flatrate ska användas baserat på betalningsalternativ
      shouldUseFlatrate = useFlatrateOption === 'flatrate';
      
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
    } else {
      // För maskiner utan credits eller för Silver/Guld-paket sätt creditprice till 0
      setCalculatedCreditPrice(0);
    }
    
    // Bestäm total driftskostnad baserat på valt paket
    let totalCost = 0;
    
    if (selectedDriftpaket === 'Bas') {
      totalCost = creditOrFlatrateCost; // Bas innehåller inga SLA-kostnader
    } else if (selectedDriftpaket === 'Silver') {
      totalCost = silverCost; // Silver inkluderar Flatrate för kreditmaskiner
    } else if (selectedDriftpaket === 'Guld') {
      totalCost = guldCost; // Guld inkluderar Flatrate för kreditmaskiner
    }
    
    // Uppdatera operatingCost state
    setOperatingCost({
      costPerMonth: creditOrFlatrateCost,
      useFlatrate: shouldUseFlatrate,
      slaCost: selectedDriftpaket === 'Bas' ? 0 : (selectedDriftpaket === 'Silver' ? silverCost : guldCost),
      totalCost: totalCost
    });
    
    console.log(`Driftskostnad beräknad för ${selectedMachine.name}:
      Betalningsalternativ: ${paymentOption}
      Driftpaket: ${selectedDriftpaket}
      Behandlingar per dag: ${treatmentsPerDay}
      Credit/Flatrate-kostnad (om Bas): ${creditOrFlatrateCost} kr
      SLA Silver kostnad: ${silverCost} kr
      SLA Guld kostnad: ${guldCost} kr
      Total driftskostnad: ${totalCost} kr
      Kreditpris: ${calculatedCreditPrice} kr
    `);
  }, [
    selectedMachine, 
    treatmentsPerDay, 
    useFlatrateOption, 
    leasingCost, 
    selectedLeasingPeriodId,
    selectedDriftpaket,
    paymentOption, 
    allowBelowFlatrate, 
    leasingMax60mRef,
    machinePriceSEK,
    creditPrice
  ]);

  return { 
    operatingCost,
    calculatedCreditPrice,
    calculatedSlaCostSilver,
    calculatedSlaCostGuld
  };
}
