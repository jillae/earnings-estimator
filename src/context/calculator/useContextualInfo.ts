
import { useEffect } from 'react';
import { infoTexts, InfoText } from '@/data/infoTexts';
import { SliderStep } from '@/utils/sliderSteps';
import { Machine } from '@/data/machines/types';
import { DriftpaketType } from '@/types/calculator';
import { FlatrateOption, PaymentOption } from '@/utils/constants';

interface UseContextualInfoProps {
  selectedMachine: Machine | undefined;
  selectedDriftpaket: DriftpaketType;
  paymentOption: PaymentOption;
  currentSliderStep: SliderStep;
  treatmentsPerDay: number;
  useFlatrateOption: FlatrateOption;
  setCurrentInfoText: (infoText: InfoText | null) => void;
}

export function useContextualInfo({
  selectedMachine,
  selectedDriftpaket,
  paymentOption,
  currentSliderStep,
  treatmentsPerDay,
  useFlatrateOption,
  setCurrentInfoText
}: UseContextualInfoProps) {
  
  // Uppdatera info-texten när relevanta states ändras
  useEffect(() => {
    if (!selectedMachine) {
      setCurrentInfoText(null);
      return;
    }
    
    const usesCredits = selectedMachine.usesCredits;
    
    // Visa maskin-specifik info när en maskin först väljs
    if (usesCredits) {
      setCurrentInfoText(infoTexts.CREDITS_MACHINE_SELECTED);
    } else {
      setCurrentInfoText(infoTexts.NON_CREDITS_MACHINE_SELECTED);
    }
    
    // Info baserad på driftpaket för maskiner som använder credits
    if (usesCredits) {
      if (selectedDriftpaket === 'Silver') {
        setCurrentInfoText(infoTexts.SILVER_PACKAGE_CREDITS);
      } else if (selectedDriftpaket === 'Guld') {
        setCurrentInfoText(infoTexts.GULD_PACKAGE_CREDITS);
      } else if (selectedDriftpaket === 'Bas') {
        // Info baserad på betalningsalternativ för Bas-paketet
        if (paymentOption === 'leasing') {
          setCurrentInfoText(infoTexts.BAS_PACKAGE_CREDITS_LEASING);
        } else {
          setCurrentInfoText(infoTexts.BAS_PACKAGE_CREDITS_CASH);
        }
      }
    }
    
    // Flatrate info (endast för kreditmaskiner med Bas-paket)
    if (usesCredits && selectedDriftpaket === 'Bas') {
      const isFlatrateUnlocked = treatmentsPerDay >= 3 && currentSliderStep >= 1;
      
      if (isFlatrateUnlocked && useFlatrateOption === 'perCredit') {
        setCurrentInfoText(infoTexts.FLATRATE_UNLOCKED_OFF);
      } else if (!isFlatrateUnlocked && useFlatrateOption === 'perCredit') {
        setCurrentInfoText(infoTexts.FLATRATE_LOCKED);
      }
    }
    
  }, [
    selectedMachine, 
    selectedDriftpaket, 
    paymentOption, 
    currentSliderStep, 
    treatmentsPerDay, 
    useFlatrateOption, 
    setCurrentInfoText
  ]);
}
