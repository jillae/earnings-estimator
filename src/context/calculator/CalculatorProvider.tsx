
import React, { useState } from 'react';
import { CalculatorContext } from './context';
import { useClinicSettings } from './useClinicSettings';
import { useMachinePricing } from './useMachinePricing';
import { useLeasingCalculations } from './useLeasingCalculations';
import { useOperatingCosts } from './useOperatingCosts';
import { useRevenueCalculations } from './useRevenueCalculations';
import { machineData } from '@/data/machines';

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Machine and options selection state
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machineData[0].id);
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>("48");
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>("yes");
  const [leaseAdjustmentFactor, setLeaseAdjustmentFactor] = useState<number>(1);
  const [customerPrice, setCustomerPrice] = useState<number>(machineData[0].defaultCustomerPrice || 1990);

  // Get clinic settings
  const { 
    clinicSize, 
    setClinicSize, 
    treatmentsPerDay, 
    setTreatmentsPerDay 
  } = useClinicSettings();

  // Get machine pricing
  const { exchangeRate, machinePriceSEK } = useMachinePricing({
    selectedMachineId,
    setCustomerPrice
  });

  // Get leasing calculations
  const { 
    leasingRange, 
    leasingCost, 
    creditPrice, 
    flatrateThreshold, 
    handleCreditPriceChange 
  } = useLeasingCalculations({
    selectedMachineId,
    machinePriceSEK,
    selectedLeasingPeriodId,
    selectedInsuranceId,
    leaseAdjustmentFactor
  });

  // Get operating costs
  const { operatingCost } = useOperatingCosts({
    selectedMachineId,
    treatmentsPerDay,
    creditPrice,
    leasingCost,
    selectedLeasingPeriodId,
    machinePriceSEK
  });

  // Get revenue calculations
  const { revenue, occupancyRevenues, netResults } = useRevenueCalculations({
    customerPrice,
    treatmentsPerDay,
    leasingCost,
    operatingCost
  });

  // Debug logs for leasing settings
  React.useEffect(() => {
    console.log("Leasing cost values:", {
      minLeaseCost: leasingRange.min,
      maxLeaseCost: leasingRange.max,
      leaseCost: leasingCost,
      actualLeasingCost: leasingCost,
      roundedMinCost: Math.round(leasingRange.min / 500) * 500,
      roundedMaxCost: Math.round(leasingRange.max / 500) * 500,
      numSteps: Math.floor((leasingRange.max - leasingRange.min) / 100),
      currentStepFactor: 1 / Math.max(1, Math.floor((leasingRange.max - leasingRange.min) / 100)),
      adjustmentFactor: leaseAdjustmentFactor
    });
  }, [leasingRange, leasingCost, leaseAdjustmentFactor]);

  // Get the currently selected machine
  const selectedMachine = machineData.find(machine => machine.id === selectedMachineId) || machineData[0];

  // Combine all values into context
  const value = {
    clinicSize,
    setClinicSize,
    selectedMachineId,
    setSelectedMachineId,
    selectedMachine,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    treatmentsPerDay,
    setTreatmentsPerDay,
    customerPrice,
    setCustomerPrice,
    exchangeRate,
    machinePriceSEK,
    leasingRange,
    leasingCost,
    creditPrice,
    handleCreditPriceChange,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    flatrateThreshold,
    operatingCost,
    revenue,
    occupancyRevenues,
    netResults,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};
