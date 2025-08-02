
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
    
    // VIKTIG REGEL: När flatrate aktiveras, hoppa ALLTID till Standard (position 1)
    if (checked) {
      // Om vi aktiverar flatrate och slider inte redan är på Standard
      if (currentSliderStep !== 1) {
        console.log('Flyttar slider till Standard (1) då flatrate aktiveras');
        setCurrentSliderStep(1);
        
        // Visa ett meddelande till användaren
        toast({
          title: "Slidern har justerats till Standard",
          description: "Flatrate kräver och fungerar bäst med standardnivå.",
          variant: "default"
        });
      }
      
      // Aktivera flatrate (med eventuell fördröjning om slider flyttades)
      const delay = currentSliderStep !== 1 ? 300 : 0;
      setTimeout(() => {
        setUseFlatrateOption(newOption);
      }, delay);
      
    } else if (!checked && !canEnableFlatrate && paymentOption === 'leasing' && currentSliderStep < 1) {
      // Om försöker deaktivera flatrate men slider är för låg för leasing
      setCurrentSliderStep(1);
      
      toast({
        title: "Slidern har justerats till Standard", 
        description: "Minst standardnivå krävs för denna leasingkonfiguration.",
        variant: "default"
      });
      
      setTimeout(() => {
        setUseFlatrateOption(newOption);
      }, 300);
    } else {
      // Annars byt direkt
      setUseFlatrateOption(newOption);
    }
  }, [setUseFlatrateOption, canEnableFlatrate, paymentOption, currentSliderStep, setCurrentSliderStep, toast]);

  // OMFATTANDE AUTOMATISK ÅTERSTÄLLNING för alla scenarios
  useEffect(() => {
    if (!selectedMachine?.usesCredits) return;

    // SCENARIO 1: Silver/Guld-paket => TVINGA flatrate
    if (selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') {
      if (useFlatrateOption !== 'flatrate') {
        console.log(`🔄 Aktiverar automatisk flatrate för ${selectedDriftpaket}-paket`);
        
        // VIKTIG: När Silver/Guld automatiskt aktiverar flatrate, flytta slider till Standard
        if (currentSliderStep !== 1) {
          console.log('📍 Flyttar slider till Standard (1) då Silver/Guld aktiverar flatrate automatiskt');
          setCurrentSliderStep(1);
        }
        
        setUseFlatrateOption('flatrate');
      }
    }
    
    // SCENARIO 2: Brons-paket => ÅTERSTÄLL till perCredit (men tillåt manuell override)
    else if (selectedDriftpaket === 'Bas') {
      // Automatisk återställning till perCredit för Brons
      if (useFlatrateOption === 'flatrate') {
        console.log('🔄 Återställer automatiskt till perCredit för Brons-paket');
        setUseFlatrateOption('perCredit');
      }
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
