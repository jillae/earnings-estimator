
import { useState, useEffect } from 'react';
import { machineData, leasingPeriods } from '@/data/machines';
import { calculateLeasingRange } from '@/utils/leasingRangeUtils';
import { calculateLeasingCost } from '@/utils/calculationUtils';
import { calculateCashPrice } from '@/utils/pricingUtils';
import { SHIPPING_COST_EUR_CREDITS, SHIPPING_COST_EUR_NO_CREDITS } from '@/utils/constants';
import { calculateLeasingMax60mRef } from '@/utils/pricingUtils';
import { calculateTariffBasedLeasingMax } from '@/utils/leasingTariffUtils';

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
  
  // Logga i konsolen vilket id som söks och vilken maskin som hittas
  console.log(`Looking for machine with id: ${selectedMachineId}, Found: ${selectedMachine ? selectedMachine.name : 'none'}`);
  
  // Beräkna leasingMax60mRef-referensvärdet när maskinen ändras
  useEffect(() => {
    async function calcValue() {
      if (selectedMachine?.priceEur) {
        // Använd direktberäkning för att få korrekt värde
        const refValue = calculateTariffBasedLeasingMax(
          selectedMachine.priceEur,
          60,
          selectedMachine.usesCredits,
          exchangeRate
        );
        setLeasingMax60mRef(refValue);
        console.log(`Beräknat leasingMax60mRef för ${selectedMachine.name}: ${refValue} SEK (direkt beräkning)`);
        
        // FELSÖKNING: Extra loggning för handheld machines
        if (['gvl', 'evrl', 'xlr8'].includes(selectedMachine.id)) {
          console.log(`FELSÖKNING ${selectedMachine.name}:
            priceEur: ${selectedMachine.priceEur}
            usesCredits: ${selectedMachine.usesCredits}
            exchangeRate: ${exchangeRate}
            Calculated leasingMax60mRef: ${refValue}
            Raw value before rounding: ${selectedMachine.priceEur * exchangeRate * 0.02095}
          `);
        }
      } else {
        setLeasingMax60mRef(0);
      }
    }
    
    calcValue();
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
    
    // VIKTIGT: För alla maskiner, inklusive handhållna, beräkna leasingkostnad med den direkta tariff-baserade metoden
    // Handhållna beräknas tidigare på ett fel sätt
    let defaultLeasingCost = 0;
    
    // För handhållna maskiner, beräkna direkt med tariff
    if (['gvl', 'evrl', 'xlr8'].includes(selectedMachine.id)) {
      const shippingCost = SHIPPING_COST_EUR_NO_CREDITS; // Handhållna använder inte krediter
      
      // Konvertera först till SEK
      const totalPriceSEK = (selectedMachine.priceEur + shippingCost) * exchangeRate;
      
      // Beräkna med tariff-faktor
      defaultLeasingCost = totalPriceSEK * leasingRate;
      
      console.log(`FELSÖKNING handhållen maskin ${selectedMachine.name}:
        priceEur: ${selectedMachine.priceEur}
        shippingCost: ${shippingCost}
        exchangeRate: ${exchangeRate}
        totalPriceSEK: ${totalPriceSEK}
        leasingRate: ${leasingRate}
        Calculated: ${defaultLeasingCost}
      `);
      
      // Sätt range baserat på detta värde
      const minLeasingCost = defaultLeasingCost * 0.9;
      const maxLeasingCost = defaultLeasingCost * 1.1;
      
      setLeasingRange({
        min: Math.round(minLeasingCost),
        default: Math.round(defaultLeasingCost),
        max: Math.round(maxLeasingCost)
      });
      
      // Sätt leasingCost till defaultvärdet
      setLeasingCost(Math.round(defaultLeasingCost));
    } else {
      // För övriga maskiner, använd normal beräkningsmetod
      // Beräkna möjligt leasingintervall
      const range = calculateLeasingRange(selectedMachine, machinePriceSEK, leasingRate, includeInsurance);
      setLeasingRange(range);
      
      // Spara flatrate threshold för UI
      if (range.flatrateThreshold) {
        setFlatrateThreshold(range.flatrateThreshold);
      }
      
      // Beräkna aktuell leasingkostnad baserat på justeringsfaktor
      // FIX: Här anropar vi calculateLeasingCost asynkront och hanterar resultatet
      const calculateCostForMachine = async () => {
        try {
          const cost = await calculateLeasingCost(
            selectedMachine,
            leasingRate,
            includeInsurance
          );
          
          // Nu kan vi uppdatera state med värdet vi fått
          setLeasingCost(cost);
          
          console.log(`Leasingkostnad asynkront beräknad för ${selectedMachine.name}: ${cost} SEK`);
        } catch (error) {
          console.error("Fel vid beräkning av leasingkostnad:", error);
          setLeasingCost(0);
        }
      };
      
      // Starta den asynkrona beräkningen
      calculateCostForMachine();
    }
    
    console.log(`Leasing calculations updated:
      Machine: ${selectedMachine.name}
      Machine price SEK: ${machinePriceSEK}
      Leasing period: ${selectedLeasingPeriodId} (rate: ${leasingRate})
      Include insurance: ${includeInsurance}
      Adjustment factor: ${leaseAdjustmentFactor}
      Range: ${leasingRange.min} - ${leasingRange.max} (default: ${leasingRange.default})
      Calculated cost: ${leasingCost}
      LeasingMax60mRef: ${leasingMax60mRef}
    `);
  }, [
    selectedMachine,
    machinePriceSEK,
    selectedLeasingPeriodId,
    selectedInsuranceId,
    leaseAdjustmentFactor,
    leasingMax60mRef,
    exchangeRate
  ]);

  return {
    leasingRange,
    leasingCost,
    flatrateThreshold,
    cashPriceSEK,
    leasingMax60mRef
  };
}
