
import { useEffect } from 'react';
import { FlatrateOption } from '@/utils/constants';
import { SliderStep } from '@/utils/sliderSteps';

/**
 * En guard-hook som säkerställer att flatrate-inställningen är korrekt baserat på villkor
 */
export function useFlatrateGuard({
  treatmentsPerDay,
  currentSliderStep,
  useFlatrateOption,
  setUseFlatrateOption,
  paymentOption
}: {
  treatmentsPerDay: number;
  currentSliderStep: SliderStep;
  useFlatrateOption: FlatrateOption;
  setUseFlatrateOption: (option: FlatrateOption) => void;
  paymentOption: 'leasing' | 'cash';
}) {
  // FIX 6: När man väljer flatrate ska slidern gå till standard (steg 2), inte steg 1
  useEffect(() => {
    // KRITISK REGEL: Vid leasing och slider < 1 (under Standard) kan användaren INTE välja flatrate
    if (paymentOption === 'leasing' && currentSliderStep < 1 && useFlatrateOption === 'flatrate') {
      console.log('🚫 FLATRATE GUARD: Återställer till styckpris - slider för låg för flatrate vid leasing');
      console.log(`   Slider position: ${currentSliderStep} (behöver vara >= 1 för flatrate)`);
      setUseFlatrateOption('perCredit');
    }
  }, [currentSliderStep, setUseFlatrateOption, paymentOption, useFlatrateOption]);
}
