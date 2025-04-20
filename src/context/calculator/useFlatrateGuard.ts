
import { useEffect } from 'react';

export function useFlatrateGuard({ treatmentsPerDay, currentSliderStep, useFlatrateOption, setUseFlatrateOption }: {
  treatmentsPerDay: number;
  currentSliderStep: number;
  useFlatrateOption: string;
  setUseFlatrateOption: (option: string) => void;
}) {
  useEffect(() => {
    if (useFlatrateOption === 'flatrate') {
      const meetsMinTreatments = treatmentsPerDay >= 3;
      const meetsSliderRequirement = currentSliderStep >= 1;
      const canEnableFlatrate = meetsMinTreatments && meetsSliderRequirement;
      if (!canEnableFlatrate) {
        setUseFlatrateOption('perCredit');
      }
    }
  }, [treatmentsPerDay, currentSliderStep, useFlatrateOption, setUseFlatrateOption]);
}
