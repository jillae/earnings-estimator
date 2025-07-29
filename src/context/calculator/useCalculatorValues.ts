
import { useMemo } from 'react';
import { useStateSelections } from './useStateSelections';
import { useClinicSettings } from './useClinicSettings';
import { useCalculationEngine } from '@/hooks/useCalculationEngine';
import { calculateStepValues, getStepValues } from '@/utils/sliderSteps';

export function useCalculatorValues() {
  // Urval och grundstate
  const state = useStateSelections();

  // *** ANVÄND DEN NYA CENTRALISERADE BERÄKNINGSMOTORN ***
  const calculationResults = useCalculationEngine({
    machine: state.selectedMachine,
    treatmentsPerDay: state.treatmentsPerDay,
    customerPrice: state.customerPrice,
    paymentOption: state.paymentOption,
    selectedLeasingPeriodId: state.selectedLeasingPeriodId,
    selectedInsuranceId: state.selectedInsuranceId,
    selectedSlaLevel: state.selectedSlaLevel,
    selectedDriftpaket: state.selectedDriftpaket,
    leaseAdjustmentFactor: 0.5,
    useFlatrateOption: state.useFlatrateOption,
    currentSliderStep: state.currentSliderStep
  });

  // Beräkna step-värden (diskreta värdepunkter för slider) - behövs fortfarande för UI
  const stepValues = useMemo(() => {
    const creditMin = state.selectedMachine?.creditMin || 149;
    const creditMax = state.selectedMachine?.creditMax || 299;
    return calculateStepValues(
      state.selectedMachine,
      calculationResults.leasingRange.min,
      calculationResults.leasingRange.default,
      calculationResults.leasingRange.max,
      creditMin,
      creditMax
    );
  }, [state.selectedMachine, calculationResults.leasingRange, state.selectedLeasingPeriodId]);

  // Värden för valt slidersteg
  const currentStepValues = useMemo(
    () => getStepValues(stepValues, state.currentSliderStep),
    [stepValues, state.currentSliderStep]
  );

  // För debug - visa om beräkningsresultaten är giltiga
  if (!calculationResults.hasValidResults && calculationResults.errors.length > 0) {
    console.warn('⚠️ useCalculatorValues: Beräkningsfel:', calculationResults.errors);
  }

  return {
    ...state,
    // Från den nya beräkningsmotorn
    exchangeRate: calculationResults.exchangeRate,
    machinePriceSEK: calculationResults.machinePriceSEK,
    leasingRange: calculationResults.leasingRange,
    leasingCost: calculationResults.leasingCost,
    creditPrice: calculationResults.creditPrice,
    calculatedCreditPrice: calculationResults.creditPrice,
    flatrateThreshold: calculationResults.flatrateThreshold,
    operatingCost: calculationResults.operatingCost,
    revenue: calculationResults.revenue,
    occupancyRevenues: calculationResults.occupancyRevenues,
    netResults: calculationResults.netResults,
    leasingMax60mRef: calculationResults.leasingMax60mRef,
    cashPriceSEK: calculationResults.cashPriceSEK,
    
    // UI-specifika värden (behövs fortfarande)
    currentSliderStep: state.currentSliderStep,
    stepValues,
    currentStepValues,
    allowBelowFlatrate: state.allowBelowFlatrate,
    useFlatrateOption: state.useFlatrateOption,
    
    // SLA-kostnader - beräknas nu internt i motorn
    calculatedSlaCostSilver: calculationResults.leasingMax60mRef * 0.25,
    calculatedSlaCostGuld: calculationResults.leasingMax60mRef * 0.50,
    
    // Metadata för debugging
    isCalculating: calculationResults.isCalculating,
    hasValidResults: calculationResults.hasValidResults,
    calculationErrors: calculationResults.errors,
    calculationWarnings: calculationResults.warnings,
    
    // Force-update funktion
    forceRecalculate: calculationResults.forceRecalculate
  };
}
