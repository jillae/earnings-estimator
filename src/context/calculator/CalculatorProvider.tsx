
import React, { useEffect, useState } from 'react';
import { CalculatorContext } from './context';
import { useStateSelections } from './useStateSelections';
import { useClinicSettings } from './useClinicSettings';
import { useMachinePricing } from './useMachinePricing';
import { useLeasingCalculations } from './useLeasingCalculations';
import { useOperatingCosts } from './useOperatingCosts';
import { useRevenueCalculations } from './useRevenueCalculations';
import { useDebugLogging } from './useDebugLogging';

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Track whether updates are coming from credit price changes
  const [isUpdatingFromCreditPrice, setIsUpdatingFromCreditPrice] = useState<boolean>(false);

  // Get state selections
  const {
    selectedMachineId,
    setSelectedMachineId,
    selectedMachine,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    customerPrice,
    setCustomerPrice
  } = useStateSelections();

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
    handleCreditPriceChange,
    setCreditPrice
  } = useLeasingCalculations({
    selectedMachineId,
    machinePriceSEK,
    selectedLeasingPeriodId,
    selectedInsuranceId,
    leaseAdjustmentFactor
  });

  // Set up debug logging
  useDebugLogging({
    leasingRange,
    leasingCost,
    leaseAdjustmentFactor
  });

  // Get operating costs
  const { 
    operatingCost,
    calculatedCreditPrice
  } = useOperatingCosts({
    selectedMachineId,
    treatmentsPerDay,
    creditPrice,
    leasingCost,
    selectedLeasingPeriodId,
    machinePriceSEK,
    isUpdatingFromCreditPrice
  });

  // Handle credit price changes from the user
  const handleCreditPriceChangeWithFlag = (newPrice: number) => {
    setIsUpdatingFromCreditPrice(true);
    handleCreditPriceChange(newPrice);
  };

  // Update credit price when calculatedCreditPrice changes from operating costs
  useEffect(() => {
    if (!isUpdatingFromCreditPrice && calculatedCreditPrice && calculatedCreditPrice !== creditPrice) {
      console.log(`Updating credit price from ${creditPrice} to ${calculatedCreditPrice} based on leasing cost`);
      setCreditPrice(calculatedCreditPrice);
    } else if (isUpdatingFromCreditPrice) {
      // Reset the flag after the update
      setIsUpdatingFromCreditPrice(false);
    }
  }, [calculatedCreditPrice, creditPrice, setCreditPrice, isUpdatingFromCreditPrice]);

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
    creditPrice,
    handleCreditPriceChange: handleCreditPriceChangeWithFlag,
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
