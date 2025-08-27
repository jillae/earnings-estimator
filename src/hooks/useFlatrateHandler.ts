
import { useCallback, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { useToast } from '@/hooks/use-toast';

export function useFlatrateHandler() {
  const { 
    selectedMachine, 
    useFlatrateOption, 
    setUseFlatrateOption, 
    treatmentsPerDay,
    leasingCost,
    flatrateThreshold,
    paymentOption,
    selectedDriftpaket,
    currentSliderStep,
    setCurrentSliderStep,
    isFlatrateViable,
    isLeasingFlatrateViable
  } = useCalculator();

  const { toast } = useToast();

  // UPPDATERAT VILLKOR: 
  // - Vid kontantköp är flatrate ALLTID valbart
  // - Vid leasing krävs att currentSliderStep >= 1 (Standard eller högre)
  // - Kräver att maskinen använder credits och är i Bas-paketet
  // - Silver/Guld-paket har automatisk flatrate
  const canEnableFlatrate = Boolean(
    selectedMachine?.usesCredits && (
      (selectedDriftpaket === 'Bas' && (
        paymentOption === 'cash' || // Vid kontant: alltid tillåtet
        (paymentOption === 'leasing' && isLeasingFlatrateViable) // Vid leasing: kräver Standard+
      )) ||
      (selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') // Automatisk flatrate för Silver/Guld
    )
  );

  const handleFlatrateChange = useCallback((checked: boolean) => {
    const newOption = checked ? 'flatrate' : 'perCredit';
    console.log(`Ändrar Flatrate-option till: ${newOption} (${checked ? 'enabled' : 'disabled'})`);
    
    if (checked) {
      // När flatrate aktiveras - flytta slider till Standard (steg 2) för bästa resultat
      if (currentSliderStep !== 2) {
        console.log('Flyttar slider till Standard (steg 2) då flatrate aktiveras');
        setCurrentSliderStep(2);
        
        toast({
          title: "Slidern har justerats till Standard+",
          description: "Flatrate fungerar bäst med förhöjd standardnivå.",
          variant: "default"
        });
      }
      
      // Aktivera flatrate DIREKT utan fördröjning
      setUseFlatrateOption(newOption);
      
    } else {
      // Deaktivera flatrate direkt - inga villkor
      setUseFlatrateOption(newOption);
    }
  }, [setUseFlatrateOption, currentSliderStep, setCurrentSliderStep, toast]);

  // OMFATTANDE AUTOMATISK ÅTERSTÄLLNING för alla scenarios
  useEffect(() => {
    if (!selectedMachine?.usesCredits) return;

    // SCENARIO 1: Silver/Guld-paket => TVINGA flatrate
    if (selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') {
      if (useFlatrateOption !== 'flatrate') {
        console.log(`🔄 Aktiverar automatisk flatrate för ${selectedDriftpaket}-paket`);
        
        // Flytta slider till Standard+ (steg 2) för optimalt flatrate-läge
        if (currentSliderStep !== 2) {
          console.log('📍 Flyttar slider till Standard+ (steg 2) då Silver/Guld aktiverar flatrate automatiskt');
          setCurrentSliderStep(2);
        }
        
        setUseFlatrateOption('flatrate');
      }
    }
    
    // SCENARIO 2: Bas-paket => TILLÅT manual override (ta bort automatisk återställning)
    else if (selectedDriftpaket === 'Bas') {
      // GÖR INGENTING - låt användaren välja fritt mellan flatrate och perCredit
      // Detta tas bort eftersom det blockerar manuellt val av flatrate i Bas-paket
    }
  }, [selectedDriftpaket, selectedMachine?.usesCredits, setUseFlatrateOption, currentSliderStep, setCurrentSliderStep, useFlatrateOption]);

  // SCENARIO 3: Maskinbyte => ÅTERSTÄLL baserat på ny maskin
  useEffect(() => {
    if (!selectedMachine?.usesCredits && useFlatrateOption === 'flatrate') {
      console.log('🔄 Återställer flatrate för maskin utan credits');
      setUseFlatrateOption('perCredit');
    }
  }, [selectedMachine?.usesCredits, useFlatrateOption, setUseFlatrateOption]);

  // SCENARIO 4: Betalningsmetod byte => SYNKA med nya villkor
  useEffect(() => {
    // Vid kontantköp: alltid tillåtet, ingen automatisk ändring
    // Vid leasing: kontrollera slider-position för Bas-paketet
    if (paymentOption === 'leasing' && selectedDriftpaket === 'Bas' && useFlatrateOption === 'flatrate' && currentSliderStep < 1) {
      console.log('🔄 Återställer flatrate för leasing vid låg slider-position');
      setUseFlatrateOption('perCredit');
    }
  }, [paymentOption, selectedDriftpaket, useFlatrateOption, currentSliderStep, setUseFlatrateOption]);

  return {
    handleFlatrateChange,
    useFlatrateOption,
    canEnableFlatrate
  };
}
