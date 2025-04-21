
import { CalculatorContextType } from './types';

export function buildContextValue(base: any, slaCosts: any): CalculatorContextType {
  // Beräkna om Flatrate är tillgängligt baserat på betalningsoption och slidersteg
  const isLeasingFlatrateViable = base.currentSliderStep >= 1;
  const isFlatrateViable = 
    (base.paymentOption === 'cash') || // Vid kontant: alltid tillgängligt
    (base.paymentOption === 'leasing' && isLeasingFlatrateViable); // Vid leasing: kräver steg >= 1
  
  return {
    ...base,
    currentInfoText: base.currentInfoText,
    setCurrentInfoText: base.setCurrentInfoText,
    slaCosts,
    leasingMax60mRef: base.leasingMax60mRef,
    // Lägg till nya egenskaper
    isFlatrateViable: isFlatrateViable,
    isLeasingFlatrateViable: isLeasingFlatrateViable
  };
}
