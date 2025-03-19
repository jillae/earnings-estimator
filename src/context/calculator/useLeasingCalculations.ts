
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
      setIsUpdatingFromCreditPrice(false);
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
      setLeasingCost(finalLeasingCost);
    }
  }, [selectedMachineId, machinePriceSEK, selectedLeasingPeriodId, selectedInsuranceId, leaseAdjustmentFactor, isUpdatingFromCreditPrice, leasingRange]);

  // Handle manual credit price changes
  const handleCreditPriceChange = (newCreditPrice: number) => {
    console.log("Credit price manually changed to:", newCreditPrice);
    
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      // Set the new credit price
      setCreditPrice(newCreditPrice);
      
      // Mark that we're updating from credit price change to prevent circular updates
      setIsUpdatingFromCreditPrice(true);
      
      // Determine the leasing cost based on credit price
      if (selectedMachine.creditMin !== undefined && 
          selectedMachine.creditMax !== undefined && 
          selectedMachine.leasingMin !== undefined && 
          selectedMachine.leasingMax !== undefined) {
        
        const creditRange = selectedMachine.creditMax - selectedMachine.creditMin;
        if (creditRange <= 0) {
          // If there's no credit range, use leasing min
          setLeasingCost(selectedMachine.leasingMin);
        } else {
          // Calculate position in the credit range (0-1)
          const creditPosition = (newCreditPrice - selectedMachine.creditMin) / creditRange;
          // Clamp the position between 0 and 1
          const clampedCreditPosition = Math.max(0, Math.min(1, creditPosition));
          // Invert the position because higher credit price = lower leasing cost
          const inverseCreditPosition = 1 - clampedCreditPosition;
          
          // Calculate the corresponding leasing cost
          const leasingRange = selectedMachine.leasingMax - selectedMachine.leasingMin;
          const newLeasingCost = selectedMachine.leasingMin + (inverseCreditPosition * leasingRange);
          
          console.log("Calculated new leasing cost from credit price:", 
            {newCreditPrice, creditPosition, clampedCreditPosition, inverseCreditPosition, newLeasingCost});
          
          // Set the new leasing cost
          setLeasingCost(newLeasingCost);
        }
      } else {
        // Fallback calculation if credit ranges aren't defined
        const newLeasingCost = 1000000 / (newCreditPrice * selectedMachine.creditPriceMultiplier);
        console.log("Calculated leasing cost from credit price using inverse multiplier:", newLeasingCost);
        setLeasingCost(newLeasingCost);
      }
    }
  };

  return {
    leasingRange,
    leasingCost,
    creditPrice,
    flatrateThreshold,
    handleCreditPriceChange,
    setCreditPrice  // Expose setCreditPrice to allow direct updates
  };
}
