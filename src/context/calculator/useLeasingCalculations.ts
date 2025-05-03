
import { useState, useEffect } from 'react';
import { machineData, leasingPeriods } from '@/data/machines';
import { calculateLeasingRange } from '@/utils/leasingRangeUtils';
import { calculateLeasingCost } from '@/utils/leasingCostUtils';
import { calculateCashPrice } from '@/utils/pricingUtils';
import { SHIPPING_COST_EUR_CREDITS, SHIPPING_COST_EUR_NO_CREDITS } from '@/utils/constants';
import { calculateLeasingMax60mRef } from '@/utils/pricingUtils';

export function useLeasingCalculations({
  selectedMachineId,
  machinePriceSEK,
  selectedLeasingPeriodId,
  selectedInsuranceId,
  leaseAdjustmentFactor,
  treatmentsPerDay,
  paymentOption = 'leasing',
  exchangeRate = 11.49260
}: {
  selectedMachineId: string;
  machinePriceSEK: number;
  selectedLeasingPeriodId: string;
  selectedInsuranceId: string;
  leaseAdjustmentFactor: number;
  treatmentsPerDay: number;
  paymentOption?: 'leasing' | 'cash';
  exchangeRate?: number;
}) {
  const [leasingRange, setLeasingRange] = useState<any>({ min: 0, max: 0, default: 0 });
  const [leasingCost, setLeasingCost] = useState<number>(0);
  const [flatrateThreshold, setFlatrateThreshold] = useState<number>(0);
  const [cashPriceSEK, setCashPriceSEK] = useState<number>(0);
  const [leasingMax60mRef, setLeasingMax60mRef] = useState<number>(0);
  
  const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
  
  // Beräkna leasingMax60mRef-referensvärdet när maskinen ändras
  useEffect(() => {
    if (selectedMachine?.priceEur) {
      const refValue = calculateLeasingMax60mRef(selectedMachine, exchangeRate);
      setLeasingMax60mRef(refValue);
      console.log(`Beräknat leasingMax60mRef för ${selectedMachine.name}: ${refValue} SEK`);
    } else {
      setLeasingMax60mRef(0);
    }
  }, [selectedMachine, exchangeRate]);
  
  // Beräkna kontantpris när maskinen ändras
  useEffect(() => {
    if (selectedMachine?.priceEur) {
      const shippingCostEur = selectedMachine.usesCredits 
        ? SHIPPING_COST_EUR_CREDITS 
        : SHIPPING_COST_EUR_NO_CREDITS;
        
      const calculatedCashPrice = calculateCashPrice(
        selectedMachine.priceEur,
        shippingCostEur,
        exchangeRate
      );
      
      setCashPriceSEK(calculatedCashPrice);
      console.log(`Beräknat kontantpris för ${selectedMachine.name}: ${calculatedCashPrice} SEK`);
    } else {
      setCashPriceSEK(0);
    }
  }, [selectedMachine, exchangeRate]);

  // Beräkna leasingintervall och kostnad
  useEffect(() => {
    if (!selectedMachine || !machinePriceSEK) {
      setLeasingRange({ min: 0, max: 0, default: 0 });
      setLeasingCost(0);
      setFlatrateThreshold(0);
      return;
    }
    
    // Hämta leasingRate baserat på vald period
    const selectedPeriod = leasingPeriods.find(period => period.id === selectedLeasingPeriodId);
    const leasingRate = selectedPeriod?.rate || 0.02095; // Default till 60 månader
    
    console.log(`Använder leasingperiod: ${selectedLeasingPeriodId} med rate: ${leasingRate}`);
    
    // Beräkna om försäkring ska inkluderas
    const includeInsurance = selectedInsuranceId === 'yes';
    console.log(`Försäkring inkluderad: ${includeInsurance}`);
    
    // Beräkna möjligt leasingintervall
    const range = calculateLeasingRange(selectedMachine, machinePriceSEK, leasingRate, includeInsurance);
    setLeasingRange(range);
    
    // Spara flatrate threshold för UI
    if (range.flatrateThreshold) {
      setFlatrateThreshold(range.flatrateThreshold);
    }
    
    // Beräkna aktuell leasingkostnad baserat på justeringsfaktor
    const cost = calculateLeasingCost(
      selectedMachine,
      machinePriceSEK,
      leasingRate,
      includeInsurance,
      leaseAdjustmentFactor
    );
    
    setLeasingCost(cost);
    
    console.log(`Leasing calculations updated:
      Machine: ${selectedMachine.name}
      Machine price SEK: ${machinePriceSEK}
      Leasing period: ${selectedLeasingPeriodId} (rate: ${leasingRate})
      Include insurance: ${includeInsurance}
      Adjustment factor: ${leaseAdjustmentFactor}
      Range: ${range.min} - ${range.max} (default: ${range.default})
      Calculated cost: ${cost}
      LeasingMax60mRef: ${leasingMax60mRef}
    `);
  }, [
    selectedMachine,
    machinePriceSEK,
    selectedLeasingPeriodId, // Säkerställer att beräkningar uppdateras vid ändring av leasingperiod
    selectedInsuranceId,
    leaseAdjustmentFactor,
    leasingMax60mRef // Lägg till beroende för att säkerställa korrekt beräkningsordning
  ]);

  return {
    leasingRange,
    leasingCost,
    flatrateThreshold,
    cashPriceSEK,
    leasingMax60mRef
  };
}
