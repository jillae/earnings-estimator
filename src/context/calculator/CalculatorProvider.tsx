
import React, { useEffect } from 'react';
import { CalculatorContext } from '../CalculatorContext';
import { useStateSelections } from './useStateSelections';
import { useClinicSettings } from './useClinicSettings';
import { useMachinePricing } from './useMachinePricing';
import { useLeasingCalculations } from './useLeasingCalculations';
import { useOperatingCosts } from './useOperatingCosts';
import { useRevenueCalculations } from './useRevenueCalculations';
import { useDebugLogging } from './useDebugLogging';
import { leasingPeriods } from '@/data/machines';
import { calculateSlaCost } from '@/utils/pricingUtils';
import { SlaLevel } from '@/utils/constants';

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get state selections
  const {
    clinicSize,
    setClinicSize,
    selectedMachineId,
    setSelectedMachineId,
    selectedMachine,
    paymentOption,
    setPaymentOption,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    selectedSlaLevel,
    setSlaLevel,
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
    flatrateThreshold,
    cashPriceSEK,
    leasingMax60mRef
  } = useLeasingCalculations({
    selectedMachineId,
    machinePriceSEK,
    selectedLeasingPeriodId,
    selectedInsuranceId,
    leaseAdjustmentFactor,
    treatmentsPerDay,
    paymentOption,
    exchangeRate
  });

  // Beräkna leasingkostnaden som en procentandel av max (0-100%)
  const leasingCostPercentage = leasingRange.max > 0 
    ? Math.round(((leasingCost - leasingRange.min) / (leasingRange.max - leasingRange.min)) * 100) 
    : 0;

  // Beräkna SLA-kostnader för alla nivåer
  const slaCosts = React.useMemo(() => {
    if (!selectedMachine) {
      return { Brons: 0, Silver: 0, Guld: 0 };
    }
    
    return {
      Brons: calculateSlaCost(selectedMachine, 'Brons', leasingMax60mRef),
      Silver: calculateSlaCost(selectedMachine, 'Silver', leasingMax60mRef),
      Guld: calculateSlaCost(selectedMachine, 'Guld', leasingMax60mRef)
    };
  }, [selectedMachine, leasingMax60mRef]);

  // Set up debug logging
  useDebugLogging({
    leasingRange,
    leasingCost,
    leaseAdjustmentFactor,
    allowBelowFlatrate,
    slaCosts,
    leasingMax60mRef
  });

  // Automatiskt återställ flatrate till perCredit om togglens villkor inte uppfylls längre
  useEffect(() => {
    if (useFlatrateOption === 'flatrate') {
      const meetsMinTreatments = treatmentsPerDay >= 3;
      const meetsLeasingRequirement = 
        paymentOption === 'cash' || 
        (flatrateThreshold && leasingCost >= flatrateThreshold);
      
      const canEnableFlatrate = meetsMinTreatments && meetsLeasingRequirement;
      
      if (!canEnableFlatrate) {
        console.log("Villkor för flatrate uppfylls inte längre, återställer till perCredit");
        setUseFlatrateOption('perCredit');
      }
    }
  }, [treatmentsPerDay, leasingCost, flatrateThreshold, paymentOption, useFlatrateOption, setUseFlatrateOption]);

  // Get operating costs - skicka med leaseAdjustmentFactor för kreditprisberäkning
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
    useFlatrateOption,
    leaseAdjustmentFactor,
    selectedSlaLevel,
    paymentOption,
    leasingMax60mRef
  });

  // Get revenue calculations
  const { revenue, occupancyRevenues, netResults } = useRevenueCalculations({
    customerPrice,
    treatmentsPerDay,
    paymentOption,
    leasingCost,
    cashPriceSEK,
    operatingCost
  });

  // Combine all values into context
  const value = {
    clinicSize,
    setClinicSize,
    selectedMachineId,
    setSelectedMachineId,
    selectedMachine,
    paymentOption,
    setPaymentOption,
    cashPriceSEK,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    selectedSlaLevel,
    setSlaLevel,
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
    calculatedCreditPrice, // Lägg till detta explicit för att fixa felet
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
    slaCosts,
    leasingMax60mRef
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};
