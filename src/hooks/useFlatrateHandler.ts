
import { useCallback } from 'react';
import { useCalculator } from '@/context/CalculatorContext';

export function useFlatrateHandler() {
  const { 
    selectedMachine, 
    useFlatrateOption, 
    setUseFlatrateOption, 
    treatmentsPerDay,
    leasingCost,
    flatrateThreshold,
    paymentOption,
    selectedDriftpaket,
    currentSliderStep
  } = useCalculator();

  // NYTT VILLKOR: 
  // - Vid kontantköp är flatrate ALLTID valbart
  // - Vid leasing krävs att currentSliderStep >= 1 (Standard eller högre)
  const canEnableFlatrate = Boolean(
    selectedMachine?.usesCredits && 
    selectedDriftpaket === 'Bas' && // Bara i Bas-paketet som flatrate-toggle är relevant
    (
      paymentOption === 'cash' || // Vid kontant: alltid tillåtet
      (paymentOption === 'leasing' && currentSliderStep >= 1) // Vid leasing: kräver Standard+
    )
  );

  const handleFlatrateChange = useCallback((checked: boolean) => {
    const newOption = checked ? 'flatrate' : 'perCredit';
    console.log(`Ändrar Flatrate-option till: ${newOption} (${checked ? 'enabled' : 'disabled'})`);
    
    setUseFlatrateOption(newOption);
  }, [setUseFlatrateOption]);

  return {
    handleFlatrateChange,
    useFlatrateOption,
    canEnableFlatrate
  };
}
