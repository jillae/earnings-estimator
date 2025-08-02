
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { FlatrateOption, SlaLevel } from '@/utils/constants';
import { calculateCreditPrice } from '@/utils/credits/creditPricing';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';
import { calculateSlaCost } from '@/utils/pricingUtils';
import { DriftpaketType } from '@/types/calculator';
import { SliderStep } from '@/utils/sliderSteps';

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
  leasingStandardRef = 0,
  creditPrice = 0,
  currentSliderStep = 1
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
  leasingStandardRef?: number;
  creditPrice?: number;
  currentSliderStep?: SliderStep;
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
    const bronsCost = calculateSlaCost(selectedMachine, 'Brons', leasingStandardRef);
    const silverCost = calculateSlaCost(selectedMachine, 'Silver', leasingStandardRef);
    const guldCost = calculateSlaCost(selectedMachine, 'Guld', leasingStandardRef);
    
    setCalculatedSlaCostSilver(silverCost);
    setCalculatedSlaCostGuld(guldCost);

    // NYTT VILLKOR:
    // - Vid kontantköp är flatrate ALLTID valbart i Bas-paket och ingår ALLTID i Silver/Guld
    // - Vid leasing krävs currentSliderStep >= 1 (Standard+)
    const isLeasingFlatrateViable = currentSliderStep >= 1;
    const isFlatrateViable = paymentOption === 'cash' || (paymentOption === 'leasing' && isLeasingFlatrateViable);

    // Beräkna credit/flatrate-kostnader
    let creditOrFlatrateCost = 0;
    let shouldUseFlatrate = false;
    let totalCost = 0;
    
    // Beräkna kreditpris
    // Använd det tillhandahållna kreditpriset, eller beräkna om det inte finns
    const effectiveCreditPrice = creditPrice || calculateCreditPrice(
      selectedMachine, 
      leasingCost, 
      paymentOption, 
      selectedLeasingPeriodId, 
      machinePriceSEK
    );
    
    // Använd exakt creditPrice utan avrundning
    const safeCreditPrice = Math.max(0, effectiveCreditPrice);
    setCalculatedCreditPrice(safeCreditPrice);
    
    // Beräkna grundläggande info om krediter/behandlingar
    const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
    const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
    const totalCreditsPerMonth = treatmentsPerMonth * creditsPerTreatment;
    
    // Beräkna styckepris-kostnader
    const styckeprisCost_Leasing = totalCreditsPerMonth * safeCreditPrice;
    const styckeprisCost_Cash = totalCreditsPerMonth * (selectedMachine.creditMin || safeCreditPrice);
    const flatrateAmount = selectedMachine.flatrateAmount || 0;

    // UPPDATERAD LOGIK för driftskostnad:
    if (!selectedMachine.usesCredits) {
      // För maskiner utan credits, använd enbart SLA-kostnaden baserat på paket
      if (selectedDriftpaket === 'Bas') {
        totalCost = 0; // Bas = 0 för icke-kreditmaskiner
      } else if (selectedDriftpaket === 'Silver') {
        totalCost = silverCost;
      } else {
        totalCost = guldCost;
      }
      
      shouldUseFlatrate = false;
      creditOrFlatrateCost = 0;
    } 
    else {
      // För kreditmaskiner - implementera logiken enligt instruktionen
      if (selectedDriftpaket === 'Bas') {
        if (paymentOption === 'cash') {
          // KONTANT + BAS: Flatrate alltid valbart
          shouldUseFlatrate = useFlatrateOption === 'flatrate';
          creditOrFlatrateCost = shouldUseFlatrate ? flatrateAmount : styckeprisCost_Cash;
        } else { // leasing
          // LEASING + BAS: Flatrate villkorat
          shouldUseFlatrate = useFlatrateOption === 'flatrate' && isLeasingFlatrateViable;
          creditOrFlatrateCost = shouldUseFlatrate ? flatrateAmount : styckeprisCost_Leasing;
        }
        
        totalCost = creditOrFlatrateCost; // Bas innehåller inga SLA-kostnader
      } 
      else if (selectedDriftpaket === 'Silver') {
        if (paymentOption === 'cash') {
          // KONTANT + SILVER: Flatrate alltid inkluderat
          shouldUseFlatrate = true;
          creditOrFlatrateCost = 0; // Redan inkluderat i SLA
          totalCost = silverCost;
        } else { // leasing
          // LEASING + SILVER: Flatrate villkorat
          shouldUseFlatrate = isLeasingFlatrateViable;
          creditOrFlatrateCost = shouldUseFlatrate ? 0 : styckeprisCost_Leasing;
          totalCost = silverCost + (shouldUseFlatrate ? 0 : styckeprisCost_Leasing);
        }
      } 
      else if (selectedDriftpaket === 'Guld') {
        if (paymentOption === 'cash') {
          // KONTANT + GULD: Flatrate alltid inkluderat
          shouldUseFlatrate = true;
          creditOrFlatrateCost = 0; // Redan inkluderat i SLA
          totalCost = guldCost;
        } else { // leasing
          // LEASING + GULD: Flatrate villkorat
          shouldUseFlatrate = isLeasingFlatrateViable;
          creditOrFlatrateCost = shouldUseFlatrate ? 0 : styckeprisCost_Leasing;
          totalCost = guldCost + (shouldUseFlatrate ? 0 : styckeprisCost_Leasing);
        }
      }
    }
    
    // Uppdatera operatingCost state med detaljerad information
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
      Current Slider Step: ${currentSliderStep}
      isFlatrateViable: ${isFlatrateViable}
      Flatrate aktiv: ${shouldUseFlatrate}
      Credit/Flatrate-kostnad: ${creditOrFlatrateCost} kr
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
    leasingStandardRef,
    machinePriceSEK,
    creditPrice,
    currentSliderStep
  ]);

  return { 
    operatingCost,
    calculatedCreditPrice,
    calculatedSlaCostSilver,
    calculatedSlaCostGuld
  };
}
