
import { useMemo } from 'react';
import { useStateSelections } from './useStateSelections';
import { useClinicSettings } from './useClinicSettings';
import { useMachinePricing } from './useMachinePricing';
import { useLeasingCalculations } from './useLeasingCalculations';
import { useOperatingCosts } from './useOperatingCosts';
import { useRevenueCalculations } from './useRevenueCalculations';
import { calculateStepValues, getStepValues } from '@/utils/sliderSteps';

export function useCalculatorValues() {
  // Urval och grundstate
  const state = useStateSelections();

  // Machine pricing
  const { exchangeRate, machinePriceSEK } = useMachinePricing({
    selectedMachineId: state.selectedMachineId,
    setCustomerPrice: state.setCustomerPrice
  });

  // Leasing-kalkyler
  const {
    leasingRange,
    flatrateThreshold,
    cashPriceSEK,
    leasingMax60mRef
  } = useLeasingCalculations({
    selectedMachineId: state.selectedMachineId,
    machinePriceSEK,
    selectedLeasingPeriodId: state.selectedLeasingPeriodId,
    selectedInsuranceId: state.selectedInsuranceId,
    leaseAdjustmentFactor: 0.5,
    treatmentsPerDay: state.treatmentsPerDay,
    paymentOption: state.paymentOption,
    exchangeRate
  });

  // Beräkna step-värden (diskreta värdepunkter för slider)
  const stepValues = useMemo(() => {
    const creditMin = state.selectedMachine?.creditMin || 149;
    const creditMax = state.selectedMachine?.creditMax || 299;
    return calculateStepValues(
      state.selectedMachine,
      leasingRange.min,
      leasingRange.default,
      leasingRange.max,
      creditMin,
      creditMax
    );
  }, [state.selectedMachine, leasingRange, state.selectedLeasingPeriodId]);

  // Värden för valt slidersteg
  const currentStepValues = useMemo(
    () => getStepValues(stepValues, state.currentSliderStep),
    [stepValues, state.currentSliderStep]
  );

  // Leasing/creditvärde från aktuellt steg
  const leasingCost = currentStepValues.leasingCost;
  const creditPrice = currentStepValues.creditPrice;

  // Driftskostnader per månad utifrån val mm
  const { operatingCost, calculatedCreditPrice, calculatedSlaCostSilver, calculatedSlaCostGuld } = useOperatingCosts({
    selectedMachineId: state.selectedMachineId,
    treatmentsPerDay: state.treatmentsPerDay,
    leasingCost,
    selectedLeasingPeriodId: state.selectedLeasingPeriodId,
    machinePriceSEK,
    allowBelowFlatrate: state.allowBelowFlatrate,
    useFlatrateOption: state.useFlatrateOption,
    leaseAdjustmentFactor: state.currentSliderStep / 2,
    selectedSlaLevel: state.selectedSlaLevel,
    selectedDriftpaket: state.selectedDriftpaket,
    paymentOption: state.paymentOption,
    leasingMax60mRef,
    creditPrice
  });

  // Resultatintäkter etc
  const { revenue, occupancyRevenues, netResults } = useRevenueCalculations({
    customerPrice: state.customerPrice,
    treatmentsPerDay: state.treatmentsPerDay,
    paymentOption: state.paymentOption,
    leasingCost,
    cashPriceSEK,
    operatingCost
  });

  return {
    ...state,
    exchangeRate,
    machinePriceSEK,
    leasingRange,
    leasingCost,
    creditPrice,
    calculatedCreditPrice: creditPrice,
    currentSliderStep: state.currentSliderStep,
    stepValues,
    currentStepValues,
    calculatedSlaCostSilver,
    calculatedSlaCostGuld,
    allowBelowFlatrate: state.allowBelowFlatrate,
    flatrateThreshold,
    useFlatrateOption: state.useFlatrateOption,
    operatingCost,
    revenue,
    occupancyRevenues,
    netResults,
    leasingMax60mRef,
    cashPriceSEK
  };
}
