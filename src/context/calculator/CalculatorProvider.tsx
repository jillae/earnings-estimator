
import React from 'react';
import { CalculatorContext } from '../CalculatorContext';
import { useCalculatorValues } from './useCalculatorValues';
import { useSlaCosts } from './useSlaCosts';
import { useFlatrateGuard } from './useFlatrateGuard';
import { useContextualInfo } from './useContextualInfo';
import { buildContextValue } from './buildContextValue';

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Få ut alla kärnvärden (det mesta av gamla logiken från tidigare fil)
  const base = useCalculatorValues();
  // SLA-värden
  const slaCosts = useSlaCosts(base.selectedMachine, base.leasingMax60mRef);
  // Flatrate-guard (uppdaterar flatrateOption baserat på villkor)
  useFlatrateGuard({
    treatmentsPerDay: base.treatmentsPerDay,
    currentSliderStep: base.currentSliderStep,
    useFlatrateOption: base.useFlatrateOption,
    setUseFlatrateOption: base.setUseFlatrateOption,
    paymentOption: base.paymentOption // Skicka med paymentOption
  });
  
  // Hantera kontextuell info
  useContextualInfo({
    selectedMachine: base.selectedMachine,
    selectedDriftpaket: base.selectedDriftpaket,
    paymentOption: base.paymentOption,
    currentSliderStep: base.currentSliderStep,
    treatmentsPerDay: base.treatmentsPerDay,
    useFlatrateOption: base.useFlatrateOption,
    setCurrentInfoText: base.setCurrentInfoText
  });

  // Bygg det färdiga context-värdet (samma struktur som förut)
  const value = buildContextValue(base, slaCosts);

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};
