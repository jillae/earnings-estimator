
import { useState, useEffect } from 'react';
import { machineData, leasingPeriods } from '@/data/machines';
import { 
  calculateLeasingRange, 
  calculateLeasingCost, 
  calculateCreditPrice 
} from '@/utils/calculatorUtils';

export function useLeasingCalculations({
  selectedMachineId,
  machinePriceSEK,
  selectedLeasingPeriodId,
  selectedInsuranceId,
  leaseAdjustmentFactor
}: {
  selectedMachineId: string;
  machinePriceSEK: number;
  selectedLeasingPeriodId: string;
  selectedInsuranceId: string;
  leaseAdjustmentFactor: number;
}) {
  const [leasingRange, setLeasingRange] = useState<{ min: number, max: number, default: number }>({ min: 0, max: 0, default: 0 });
  const [leasingCost, setLeasingCost] = useState<number>(0);
  const [creditPrice, setCreditPrice] = useState<number>(0);
  const [flatrateThreshold, setFlatrateThreshold] = useState<number>(0);
  const [isUpdatingFromCreditPrice, setIsUpdatingFromCreditPrice] = useState<boolean>(false);
  const [isUpdatingFromLeasingCost, setIsUpdatingFromLeasingCost] = useState<boolean>(false);

  // Calculate leasing range when machine or leasing options change
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    const selectedLeasingPeriod = leasingPeriods.find(period => period.id === selectedLeasingPeriodId);
    const includeInsurance = selectedInsuranceId === 'yes';
    
    if (selectedMachine && selectedLeasingPeriod) {
      const range = calculateLeasingRange(
        selectedMachine,
        machinePriceSEK,
        selectedLeasingPeriod.rate,
        includeInsurance
      );
      
      console.log("Leasing range calculated:", range);
      setLeasingRange(range);
      
      // Update machine object with dynamic leasing range (this is modifying the imported object, may need revision)
      selectedMachine.leasingMax = range.max;
      selectedMachine.leasingMin = range.min;
      console.log(`Updated ${selectedMachine.name} with dynamic leasing range: min=${range.min}, max=${range.max}`);
      
      // Reset adjustment factor for non-credit machines
      if (!selectedMachine.usesCredits) {
        // This will trigger the leasing cost calculation in the next effect
      }
      
      // Calculate flatrate threshold for machines that use credits
      if (selectedMachine.usesCredits) {
        const threshold = range.max * 0.8;
        console.log("Flatrate threshold calculated:", threshold);
        setFlatrateThreshold(threshold);
      }
    }
  }, [selectedMachineId, machinePriceSEK, selectedLeasingPeriodId, selectedInsuranceId]);

  // Calculate leasing cost when adjustment factor changes
  useEffect(() => {
    if (isUpdatingFromCreditPrice) {
      console.log("Skipping leasing cost calculation because update is from credit price change");
      return;
    }
    
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    const selectedLeasingPeriod = leasingPeriods.find(period => period.id === selectedLeasingPeriodId);
    const includeInsurance = selectedInsuranceId === 'yes';
    
    if (selectedMachine && selectedLeasingPeriod) {
      console.log(`Calculating leasing cost with adjustment factor: ${leaseAdjustmentFactor}`);
      
      const calculatedLeasingCost = calculateLeasingCost(
        selectedMachine,
        machinePriceSEK,
        selectedLeasingPeriod.rate,
        includeInsurance,
        leaseAdjustmentFactor
      );
      
      let finalLeasingCost = calculatedLeasingCost;
      
      if (!includeInsurance && finalLeasingCost > leasingRange.max) {
        finalLeasingCost = leasingRange.max;
      } else if (includeInsurance) {
        let insuranceRate = 0.015;
        if (machinePriceSEK <= 10000) {
          insuranceRate = 0.04;
        } else if (machinePriceSEK <= 20000) {
          insuranceRate = 0.03;
        } else if (machinePriceSEK <= 50000) {
          insuranceRate = 0.025;
        }
        const insuranceCost = machinePriceSEK * insuranceRate / 12;
        
        const costWithoutInsurance = finalLeasingCost - insuranceCost;
        if (costWithoutInsurance > leasingRange.max) {
          finalLeasingCost = leasingRange.max + insuranceCost;
        }
      }
      
      console.log("Calculated leasing cost:", calculatedLeasingCost, "Final adjusted cost:", finalLeasingCost);
      setIsUpdatingFromLeasingCost(true);
      setLeasingCost(finalLeasingCost);
    }
  }, [selectedMachineId, machinePriceSEK, selectedLeasingPeriodId, selectedInsuranceId, leaseAdjustmentFactor, isUpdatingFromCreditPrice, leasingRange]);

  // Calculate credit price from leasing cost
  useEffect(() => {
    if (isUpdatingFromCreditPrice) {
      console.log("Resetting isUpdatingFromCreditPrice flag");
      setIsUpdatingFromCreditPrice(false);
      return;
    }
    
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      const calculatedCreditPrice = calculateCreditPrice(
        selectedMachine, 
        leasingCost,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      console.log("Calculated credit price from leasing cost:", calculatedCreditPrice);
      setCreditPrice(calculatedCreditPrice);
    }
    
    setIsUpdatingFromLeasingCost(false);
  }, [selectedMachineId, leasingCost, isUpdatingFromCreditPrice, machinePriceSEK, selectedLeasingPeriodId]);

  // Handle manual credit price changes
  const handleCreditPriceChange = (newCreditPrice: number) => {
    console.log("Credit price manually changed to:", newCreditPrice);
    
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      setCreditPrice(newCreditPrice);
      
      let newLeasingCost = 0;
      
      if (selectedMachine.creditMin !== undefined && 
          selectedMachine.creditMax !== undefined && 
          selectedMachine.leasingMin !== undefined && 
          selectedMachine.leasingMax !== undefined) {
        
        const creditRange = selectedMachine.creditMax - selectedMachine.creditMin;
        if (creditRange <= 0) {
          newLeasingCost = selectedMachine.leasingMin;
        } else {
          const creditPosition = (newCreditPrice - selectedMachine.creditMin) / creditRange;
          const clampedCreditPosition = Math.max(0, Math.min(1, creditPosition));
          const inverseCreditPosition = 1 - clampedCreditPosition;
          const leasingRange = selectedMachine.leasingMax - selectedMachine.leasingMin;
          newLeasingCost = selectedMachine.leasingMin + (inverseCreditPosition * leasingRange);
          
          console.log("Calculated new leasing cost from credit price:", 
            {newCreditPrice, creditPosition, clampedCreditPosition, inverseCreditPosition, newLeasingCost});
          
          if (newCreditPrice >= selectedMachine.creditMax) {
            newLeasingCost = selectedMachine.leasingMin;
          } else if (newCreditPrice <= selectedMachine.creditMin) {
            newLeasingCost = selectedMachine.leasingMax;
          }
        }
      } else {
        newLeasingCost = 1000000 / (newCreditPrice * selectedMachine.creditPriceMultiplier);
        console.log("Calculated leasing cost from credit price using inverse multiplier:", newLeasingCost);
      }
      
      const leasingDiff = leasingRange.max - leasingRange.min;
      if (leasingDiff > 0) {
        const newFactor = (newLeasingCost - leasingRange.min) / leasingDiff;
        const clampedFactor = Math.max(0, Math.min(1, newFactor));
        
        console.log("New adjustment factor from credit price:", clampedFactor);
        setIsUpdatingFromCreditPrice(true);
        setLeasingCost(newLeasingCost);
      } else {
        setIsUpdatingFromCreditPrice(true);
        setLeasingCost(newLeasingCost);
      }
    }
  };

  return {
    leasingRange,
    leasingCost,
    creditPrice,
    flatrateThreshold,
    handleCreditPriceChange
  };
}
