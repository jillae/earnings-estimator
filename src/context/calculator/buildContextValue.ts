
import { CalculatorContextType } from './types';

export function buildContextValue(base: any, slaCosts: any): CalculatorContextType {
  // Kontrollera om vi har en giltig maskin vald
  const noMachineSelected = !base.selectedMachine || 
                           base.selectedMachine.id === 'null-machine' || 
                           base.selectedMachine.id === 'select-machine';
  
  // Beräkna om Flatrate är tillgängligt baserat på betalningsoption och slidersteg
  const isLeasingFlatrateViable = base.currentSliderStep >= 1;
  const isFlatrateViable = 
    (base.paymentOption === 'cash') || // Vid kontant: alltid tillgängligt
    (base.paymentOption === 'leasing' && isLeasingFlatrateViable); // Vid leasing: kräver steg >= 1
  
  // Säkerställ att alla värden är 0 när ingen maskin är vald
  const safeValues = {
    ...base,
    leasingCost: noMachineSelected ? 0 : base.leasingCost,
    leasingRange: noMachineSelected ? { min: 0, max: 0, default: 0 } : base.leasingRange
  };
  
  return {
    ...safeValues,
    currentInfoText: base.currentInfoText,
    setCurrentInfoText: base.setCurrentInfoText,
    slaCosts,
    leasingMax60mRef: base.leasingMax60mRef,
    // Lägg till nya egenskaper
    isFlatrateViable: isFlatrateViable,
    isLeasingFlatrateViable: isLeasingFlatrateViable,
    setCurrentSliderStep: base.setCurrentSliderStep
  };
}
