
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
  useEffect(() => {
    // KRITISK REGEL: Vid leasing och slider < 1 (under Standard) kan användaren INTE välja flatrate
    // Växla OMEDELBART till perCredit utan fördröjning
    if (paymentOption === 'leasing' && currentSliderStep < 1 && useFlatrateOption === 'flatrate') {
      console.log('🚫 FLATRATE GUARD: Slider flyttad under Standard - växlar DIREKT till styckpris');
      console.log(`   Slider position: ${currentSliderStep} (kräver >= 1 för flatrate vid leasing)`);
      setUseFlatrateOption('perCredit');
    }
  }, [currentSliderStep, setUseFlatrateOption, paymentOption, useFlatrateOption]);
}
