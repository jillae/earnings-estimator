
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
    
    // Om försöker aktivera flatrate men inte uppfyller villkoren
    if (checked && !canEnableFlatrate && paymentOption === 'leasing' && currentSliderStep < 1) {
      // Återställ slidern till standardläget (1)
      setCurrentSliderStep(1);
      
      // Visa ett meddelande till användaren
      toast({
        title: "Slidern har justerats till standard",
        description: "Flatrate kräver minst standardnivå på leasingbalansen.",
        variant: "default"
      });
      
      // Fördröj uppdateringen av flatrate-option tills slidern har ändrats
      setTimeout(() => {
        setUseFlatrateOption(newOption);
      }, 300);
    } else {
      // Annars byt direkt
      setUseFlatrateOption(newOption);
    }
  }, [setUseFlatrateOption, canEnableFlatrate, paymentOption, currentSliderStep, setCurrentSliderStep, toast]);

  // Automatisk aktivering av flatrate för Silver/Guld-paket
  useEffect(() => {
    if (selectedMachine?.usesCredits && (selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld')) {
      if (useFlatrateOption !== 'flatrate') {
        console.log(`Aktiverar automatisk flatrate för ${selectedDriftpaket}-paket`);
        setUseFlatrateOption('flatrate');
      }
    }
  }, [selectedDriftpaket, selectedMachine?.usesCredits, setUseFlatrateOption]); // Ta bort useFlatrateOption från dependencies för att undvika loop

  return {
    handleFlatrateChange,
    useFlatrateOption,
    canEnableFlatrate
  };
}
