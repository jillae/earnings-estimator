
import { useState, useEffect } from 'react';
import { machineData, leasingPeriods } from '@/data/machines';
import { 
  calculateLeasingRange, 
  calculateLeasingCost
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
  const [flatrateThreshold, setFlatrateThreshold] = useState<number>(0);

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
        const threshold = range.min + (range.max - range.min) * 0.8;
        console.log("Flatrate threshold calculated:", threshold);
        setFlatrateThreshold(threshold);
      }
    }
  }, [selectedMachineId, machinePriceSEK, selectedLeasingPeriodId, selectedInsuranceId]);

  // Calculate leasing cost when adjustment factor changes
  useEffect(() => {
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
  }, [selectedMachineId, machinePriceSEK, selectedLeasingPeriodId, selectedInsuranceId, leaseAdjustmentFactor, leasingRange]);

  return {
    leasingRange,
    leasingCost,
    flatrateThreshold
  };
}
