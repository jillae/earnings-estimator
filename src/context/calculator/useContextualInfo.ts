
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
  setCurrentSliderStep: (step: SliderStep) => void;
}

export function useContextualInfo({
  selectedMachine,
  selectedDriftpaket,
  paymentOption,
  currentSliderStep,
  treatmentsPerDay,
  useFlatrateOption,
  setCurrentInfoText,
  setCurrentSliderStep
}: UseContextualInfoProps) {
  
  // FIX 6: När användaren väljer flatrate, sätt slider till standard (steg 2)
  useEffect(() => {
    if (useFlatrateOption === 'flatrate' && selectedMachine?.usesCredits && currentSliderStep !== 2) {
      console.log('🎯 useContextualInfo: Flatrate vald, sätter slider till standard (steg 2)');
      setCurrentSliderStep(2);
      setCurrentInfoText({
        title: "Slidern har justerats till Standard",
        body: "Flatrate kräver och fungerar bäst med standardnivå."
      });
    }
  }, [useFlatrateOption, selectedMachine, currentSliderStep, setCurrentSliderStep, setCurrentInfoText]);
  
  // Uppdatera info-texten när relevanta states ändras
  useEffect(() => {
    if (!selectedMachine) {
      setCurrentInfoText(null);
      return;
    }
    
    const usesCredits = selectedMachine.usesCredits;
    const isLeasingFlatrateViable = currentSliderStep >= 1;
    
    // Visa maskin-specifik info när en maskin först väljs
    if (usesCredits) {
      setCurrentInfoText(infoTexts.CREDITS_MACHINE_SELECTED);
    } else {
      setCurrentInfoText(infoTexts.NON_CREDITS_MACHINE_SELECTED);
    }
    
    // Info baserad på driftpaket för maskiner som använder credits
    if (usesCredits) {
      if (selectedDriftpaket === 'Silver') {
        if (paymentOption === 'cash') {
          // Kontant + Silver: Flatrate alltid inkluderat
          setCurrentInfoText(infoTexts.SILVER_PACKAGE_CASH);
        } else {
          // Leasing + Silver: Villkorad Flatrate
          if (isLeasingFlatrateViable) {
            setCurrentInfoText(infoTexts.SILVER_PACKAGE_LEASING_FLATRATE_ACTIVE);
          } else {
            setCurrentInfoText(infoTexts.SILVER_PACKAGE_LEASING_FLATRATE_INACTIVE);
          }
        }
      } else if (selectedDriftpaket === 'Guld') {
        if (paymentOption === 'cash') {
          // Kontant + Guld: Flatrate alltid inkluderat
          setCurrentInfoText(infoTexts.GULD_PACKAGE_CASH);
        } else {
          // Leasing + Guld: Villkorad Flatrate
          if (isLeasingFlatrateViable) {
            setCurrentInfoText(infoTexts.GULD_PACKAGE_LEASING_FLATRATE_ACTIVE);
          } else {
            setCurrentInfoText(infoTexts.GULD_PACKAGE_LEASING_FLATRATE_INACTIVE);
          }
        }
      } else if (selectedDriftpaket === 'Bas') {
        // Bas paket: Skilda info-texter för Leasing vs Kontant
        if (paymentOption === 'leasing') {
          setCurrentInfoText(infoTexts.BAS_PACKAGE_CREDITS_LEASING);
          
          // KRITISK VARNING: Visa info om flatrate endast vid leasing + slider < 1
          if (currentSliderStep < 1) {
            console.log('⚠️ ANVÄNDARVARNING: Slider för låg för flatrate - visar förklaring');
            setCurrentInfoText(infoTexts.FLATRATE_NEEDS_HIGHER_LEASE);
          }
        } else {
          // Kontant: Alltid tillgängligt med flatrate
          setCurrentInfoText(infoTexts.BAS_PACKAGE_CREDITS_CASH);
        }
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
