
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
  // När slider-steget ändras, säkerställ korrekt flatrate-option
  useEffect(() => {
    // NYTT VILLKOR:
    // Bara vid leasing och step < 1 ska vi tvinga per-credit
    if (paymentOption === 'leasing' && currentSliderStep < 1 && useFlatrateOption === 'flatrate') {
      console.log('Återställer flatrate-val till perCredit då slider < 1 och leasing');
      setUseFlatrateOption('perCredit');
    }
  }, [currentSliderStep, setUseFlatrateOption, paymentOption]); // Ta bort useFlatrateOption från dependencies för att undvika loop
}
