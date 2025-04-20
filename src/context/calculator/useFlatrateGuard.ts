
import { useEffect } from 'react';
import { FlatrateOption } from '@/utils/constants';

export function useFlatrateGuard({ treatmentsPerDay, currentSliderStep, useFlatrateOption, setUseFlatrateOption }: {
  treatmentsPerDay: number;
  currentSliderStep: number;
  useFlatrateOption: string;
  setUseFlatrateOption: (option: FlatrateOption) => void;
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
