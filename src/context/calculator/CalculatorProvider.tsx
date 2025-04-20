import React from 'react';
import { CalculatorContext } from '../CalculatorContext';
import { useCalculatorValues } from './useCalculatorValues';
import { useSlaCosts } from './useSlaCosts';
import { useFlatrateGuard } from './useFlatrateGuard';
import { buildContextValue } from './contextValue';

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
  });

  // Bygg det färdiga context-värdet (samma struktur som förut)
  const value = buildContextValue(base, slaCosts);

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};
