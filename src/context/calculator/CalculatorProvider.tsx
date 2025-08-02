
import React from 'react';
import { CalculatorContext } from './context';
import { useCalculatorValues } from './useCalculatorValues';
import { useSlaCosts } from './useSlaCosts';
import { useFlatrateGuard } from './useFlatrateGuard';
import { useContextualInfo } from './useContextualInfo';
import { buildContextValue } from './buildContextValue';
import { useGatedAccess } from './useGatedAccess';
import { RegistrationModal } from '@/components/RegistrationModal';
import { GatedOverlay } from '@/components/GatedOverlay';

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Gated access hantering
  const gatedAccess = useGatedAccess();
  
  // Få ut alla kärnvärden (det mesta av gamla logiken från tidigare fil)
  const base = useCalculatorValues();
  // SLA-värden
  const slaCosts = useSlaCosts(base.selectedMachine, base.leasingStandardRef);
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
    setCurrentInfoText: base.setCurrentInfoText,
    setCurrentSliderStep: base.setCurrentSliderStep
  });

  // Bygg det färdiga context-värdet (samma struktur som förut)
  const value = buildContextValue(base, slaCosts, gatedAccess);

  return (
    <CalculatorContext.Provider value={value}>
      <div className="relative">
        {children}
        <RegistrationModal
          isOpen={gatedAccess.showOptIn}
          onClose={() => gatedAccess.setShowOptIn(false)}
          onSuccess={gatedAccess.handleOptInSuccess}
        />
      </div>
    </CalculatorContext.Provider>
  );
};
