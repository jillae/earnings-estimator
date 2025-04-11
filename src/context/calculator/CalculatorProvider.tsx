
import React from 'react';
import { CalculatorContext } from '../CalculatorContext';
import { useStateSelections } from './useStateSelections';
import { useClinicSettings } from './useClinicSettings';
import { useMachinePricing } from './useMachinePricing';
import { useLeasingCalculations } from './useLeasingCalculations';
import { useOperatingCosts } from './useOperatingCosts';
import { useRevenueCalculations } from './useRevenueCalculations';
import { useDebugLogging } from './useDebugLogging';
import { leasingPeriods } from '@/data/machines';

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get state selections
  const {
    clinicSize,
    setClinicSize,
    selectedMachineId,
    setSelectedMachineId,
    selectedMachine,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    allowBelowFlatrate,
    setAllowBelowFlatrate,
    customerPrice,
    setCustomerPrice,
    useFlatrateOption,
    setUseFlatrateOption,
    treatmentsPerDay,
    setTreatmentsPerDay
  } = useStateSelections();

  // Sätt standard leasingperiod om det inte är valt
  React.useEffect(() => {
    if (!selectedLeasingPeriodId && leasingPeriods.length > 0) {
      setSelectedLeasingPeriodId(leasingPeriods[1].id); // Välj 36 månader som standard
    }
    if (!selectedInsuranceId) {
      setSelectedInsuranceId('no'); // Välj ingen försäkring som standard
    }
  }, [selectedLeasingPeriodId, selectedInsuranceId, setSelectedLeasingPeriodId, setSelectedInsuranceId]);

  // Get machine pricing
  const { exchangeRate, machinePriceSEK } = useMachinePricing({
    selectedMachineId,
    setCustomerPrice
  });

  // Get leasing calculations
  const { 
    leasingRange, 
    leasingCost, 
    flatrateThreshold
  } = useLeasingCalculations({
    selectedMachineId,
    machinePriceSEK,
    selectedLeasingPeriodId,
    selectedInsuranceId,
    leaseAdjustmentFactor,
    treatmentsPerDay
  });

  // Beräkna leasingkostnaden som en procentandel av max (0-100%)
  const leasingCostPercentage = leasingRange.max > 0 
    ? Math.round(((leasingCost - leasingRange.min) / (leasingRange.max - leasingRange.min)) * 100) 
    : 0;

  // Set up debug logging
  useDebugLogging({
    leasingRange,
    leasingCost,
    leaseAdjustmentFactor,
    allowBelowFlatrate
  });

  // Get operating costs - skicka med useFlatrateOption
  const { 
    operatingCost,
    calculatedCreditPrice
  } = useOperatingCosts({
    selectedMachineId,
    treatmentsPerDay,
    leasingCost,
    selectedLeasingPeriodId,
    machinePriceSEK,
    allowBelowFlatrate,
    useFlatrateOption
  });

  // Get revenue calculations
  const { revenue, occupancyRevenues, netResults } = useRevenueCalculations({
    customerPrice,
    treatmentsPerDay,
    leasingCost,
    operatingCost
  });

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
    leasingCostPercentage,
    creditPrice: calculatedCreditPrice,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    allowBelowFlatrate,
    setAllowBelowFlatrate,
    flatrateThreshold,
    useFlatrateOption,
    setUseFlatrateOption,
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
