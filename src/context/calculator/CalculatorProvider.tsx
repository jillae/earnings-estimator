
import React, { useEffect, useMemo } from 'react';
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
import { calculateStepValues, getStepValues, SliderStep } from '@/utils/sliderSteps';

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
    selectedDriftpaket,
    setSelectedDriftpaket,
    currentSliderStep,
    setCurrentSliderStep,
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
    flatrateThreshold,
    cashPriceSEK,
    leasingMax60mRef
  } = useLeasingCalculations({
    selectedMachineId,
    machinePriceSEK,
    selectedLeasingPeriodId,
    selectedInsuranceId,
    leaseAdjustmentFactor: 0.5, // Detta värde används inte längre direkt för beräkning
    treatmentsPerDay,
    paymentOption,
    exchangeRate
  });

  // Beräkna stepValues baserat på leasingRange och maskininformation
  const stepValues = useMemo(() => {
    // För kreditmin/kreditmax, använd värden från maskinen eller defaultvärden
    const creditMin = selectedMachine?.creditMin || 149;
    const creditMax = selectedMachine?.creditMax || 299;
    
    return calculateStepValues(
      selectedMachine,
      leasingRange.min,
      leasingRange.default, // Detta är gamla leasingMax, används som Standard (steg 1)
      leasingRange.max,     // Detta är det expanderade nya leasingMax
      creditMin,
      creditMax
    );
  }, [selectedMachine, leasingRange, selectedLeasingPeriodId]);

  // Hämta aktuella värden för valt steg
  const currentStepValues = useMemo(() => {
    return getStepValues(stepValues, currentSliderStep);
  }, [stepValues, currentSliderStep]);

  // Uppdatera leasingCost och creditPrice baserat på valt steg
  const leasingCost = currentStepValues.leasingCost;
  const creditPrice = currentStepValues.creditPrice;

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
    leaseAdjustmentFactor: currentSliderStep / 2, // För kompatibilitet med loggning
    allowBelowFlatrate,
    slaCosts,
    leasingMax60mRef
  });

  // Nytt villkor för flatrate: treatmentsPerDay >= 3 OCH currentSliderStep >= 1
  useEffect(() => {
    if (useFlatrateOption === 'flatrate') {
      const meetsMinTreatments = treatmentsPerDay >= 3;
      const meetsSliderRequirement = currentSliderStep >= 1;
      
      const canEnableFlatrate = meetsMinTreatments && meetsSliderRequirement;
      
      if (!canEnableFlatrate) {
        console.log("Villkor för flatrate uppfylls inte längre, återställer till perCredit");
        setUseFlatrateOption('perCredit');
      }
    }
  }, [treatmentsPerDay, currentSliderStep, useFlatrateOption, setUseFlatrateOption]);

  // Get operating costs
  const { 
    operatingCost,
    calculatedCreditPrice,
    calculatedSlaCostSilver,
    calculatedSlaCostGuld
  } = useOperatingCosts({
    selectedMachineId,
    treatmentsPerDay,
    leasingCost,
    selectedLeasingPeriodId,
    machinePriceSEK,
    allowBelowFlatrate,
    useFlatrateOption,
    leaseAdjustmentFactor: currentSliderStep / 2, // För kompatibilitet med gamla funktioner
    selectedSlaLevel,
    selectedDriftpaket,
    paymentOption,
    leasingMax60mRef,
    creditPrice // Skicka med den nya, exakta creditPrice från stepValues
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
    selectedDriftpaket,
    setSelectedDriftpaket,
    treatmentsPerDay,
    setTreatmentsPerDay,
    customerPrice,
    setCustomerPrice,
    exchangeRate,
    machinePriceSEK,
    leasingRange,
    leasingCost,
    creditPrice,
    calculatedCreditPrice: creditPrice, // Används för kompatibilitet
    currentSliderStep,
    setCurrentSliderStep,
    stepValues,
    currentStepValues,
    calculatedSlaCostSilver,
    calculatedSlaCostGuld,
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
