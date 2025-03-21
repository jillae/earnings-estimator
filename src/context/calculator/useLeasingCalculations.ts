
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
  leaseAdjustmentFactor,
  treatmentsPerDay = 0
}: {
  selectedMachineId: string;
  machinePriceSEK: number;
  selectedLeasingPeriodId: string;
  selectedInsuranceId: string;
  leaseAdjustmentFactor: number;
  treatmentsPerDay?: number;
}) {
  const [leasingRange, setLeasingRange] = useState<{ min: number, max: number, default: number, flatrateThreshold?: number }>({ 
    min: 0, max: 0, default: 0 
  });
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
      
      // Calculate flatrate threshold for machines that use credits
      if (selectedMachine.usesCredits) {
        // Set threshold at 80% of the way from min to max
        const threshold = range.flatrateThreshold || (range.min + (range.max - range.min) * 0.8);
        console.log("Flatrate threshold calculated:", threshold);
        setFlatrateThreshold(threshold);
        
        // Include flatrateThreshold in the range object
        range.flatrateThreshold = threshold;
      }
      
      setLeasingRange(range);
    }
  }, [selectedMachineId, machinePriceSEK, selectedLeasingPeriodId, selectedInsuranceId]);

  // Calculate leasing cost whenever adjustment factor changes
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && leasingRange.min !== undefined && leasingRange.max !== undefined) {
      // Direkt linjär interpolation mellan min och max baserat på justeringsfaktorn
      const newLeasingCost = leasingRange.min + (leaseAdjustmentFactor * (leasingRange.max - leasingRange.min));
      
      console.log(`Beräknar leasingkostnad med justeringsfaktor ${leaseAdjustmentFactor}:
        Min: ${leasingRange.min}
        Max: ${leasingRange.max}
        Range: ${leasingRange.max - leasingRange.min}
        Beräknad kostnad: ${newLeasingCost}
      `);
      
      // Uppdatera leasingkostnaden baserat på den linjära interpoleringen
      setLeasingCost(Math.round(newLeasingCost));
    }
  }, [leaseAdjustmentFactor, leasingRange, selectedMachineId]);

  return {
    leasingRange,
    leasingCost,
    flatrateThreshold,
    treatmentsPerDay
  };
}
