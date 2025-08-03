
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
    currentSliderStep: state.currentSliderStep,
    workDaysPerMonth: state.workDaysPerMonth
  });

  // Beräkna step-värden (diskreta värdepunkter för slider) - behövs fortfarande för UI
  const stepValues = useMemo(() => {
    if (!state.selectedMachine) {
      return {
        0: { leasingCost: 0, creditPrice: 0, label: 'Min' },
        1: { leasingCost: 0, creditPrice: 0, label: 'Låg' },
        2: { leasingCost: 0, creditPrice: 0, label: 'Standard' },
        3: { leasingCost: 0, creditPrice: 0, label: 'Hög' },
        4: { leasingCost: 0, creditPrice: 0, label: 'Max' }
      };
    }
    
    return calculateStepValues(
      state.selectedMachine,
      calculationResults.leasingRange.min,
      calculationResults.leasingRange.default,
      calculationResults.leasingRange.max,
      state.selectedMachine.creditMax,
      state.selectedMachine.creditMid1,
      state.selectedMachine.creditMid2,
      state.selectedMachine.creditMid3
    );
  }, [state.selectedMachine, calculationResults.leasingRange, state.selectedLeasingPeriodId]);

  // Värden för valt slidersteg
  const currentStepValues = useMemo(
    () => getStepValues(stepValues, state.currentSliderStep),
    [stepValues, state.currentSliderStep]
  );


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
    leasingStandardRef: calculationResults.leasingStandardRef,
    cashPriceSEK: calculationResults.cashPriceSEK,
    
    // UI-specifika värden (behövs fortfarande)
    currentSliderStep: state.currentSliderStep,
    stepValues,
    currentStepValues,
    allowBelowFlatrate: state.allowBelowFlatrate,
    useFlatrateOption: state.useFlatrateOption,
    
    // SLA-kostnader - beräknas nu internt i motorn
    calculatedSlaCostSilver: calculationResults.leasingStandardRef * 0.25, // 25% av standard referensvärde
    calculatedSlaCostGuld: calculationResults.leasingStandardRef * 0.50,   // 50% av standard referensvärde
    
    // Metadata
    isCalculating: calculationResults.isCalculating,
    hasValidResults: calculationResults.hasValidResults,
    calculationErrors: calculationResults.errors,
    calculationWarnings: calculationResults.warnings,
    
    // Force-update funktion
    forceRecalculate: calculationResults.forceRecalculate
  };
}
