
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

  // Nytt villkor: treatmentsPerDay >= 3 OCH currentSliderStep >= 1 (alltså Standard eller högre)
  const canEnableFlatrate = Boolean(
    selectedMachine?.usesCredits && 
    treatmentsPerDay >= 3 && 
    currentSliderStep >= 1 &&
    selectedDriftpaket === 'Bas'  // Bara i Bas-paketet som flatrate-toggle är relevant
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
