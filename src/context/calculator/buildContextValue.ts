
import { CalculatorContextType } from './types';

export function buildContextValue(
  base: any, 
  slaCosts: any, 
  gatedAccess?: ReturnType<typeof import('./useGatedAccess').useGatedAccess>
): CalculatorContextType {
  // Kontrollera om vi har en giltig maskin vald
  const noMachineSelected = !base.selectedMachine || 
                           base.selectedMachine.id === 'null-machine' || 
                           base.selectedMachine.id === 'select-machine';
  
  // Om maskinen inte använder credits, ska flatrate aldrig vara tillgängligt
  const usesCredits = base.selectedMachine?.usesCredits || false;
  
  // Beräkna om Flatrate är tillgängligt baserat på betalningsoption och slidersteg
  // Bara relevant för maskiner som använder credits
  const isLeasingFlatrateViable = usesCredits ? (base.currentSliderStep >= 1) : false;
  const isFlatrateViable = usesCredits && 
    ((base.paymentOption === 'cash') || // Vid kontant: alltid tillgängligt
    (base.paymentOption === 'leasing' && isLeasingFlatrateViable)); // Vid leasing: kräver steg >= 1
  
  console.log(`buildContextValue:
    usesCredits: ${usesCredits}
    paymentOption: ${base.paymentOption}
    currentSliderStep: ${base.currentSliderStep}
    isLeasingFlatrateViable: ${isLeasingFlatrateViable}
    isFlatrateViable: ${isFlatrateViable}
  `);
  
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
    leasingStandardRef: base.leasingStandardRef,
    // Lägg till nya egenskaper
    isFlatrateViable: isFlatrateViable,
    isLeasingFlatrateViable: isLeasingFlatrateViable,
    
    // Gated access funktionalitet
    isUnlocked: gatedAccess?.isUnlocked ?? true,
    triggerOptIn: gatedAccess?.triggerOptIn ?? (() => true),
    logInteraction: gatedAccess?.logInteraction ?? (() => {}),
    logSignificantInteraction: gatedAccess?.logSignificantInteraction ?? (() => {}),
    interactionCount: gatedAccess?.interactionCount ?? 0,
  };
}
