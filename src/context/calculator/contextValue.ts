import { CalculatorContextType } from './types';

export function buildContextValue(base: any, slaCosts: any): CalculatorContextType {
  return {
    ...base,
    currentInfoText: base.currentInfoText,
    setCurrentInfoText: base.setCurrentInfoText,
    slaCosts,
    leasingMax60mRef: base.leasingMax60mRef
  };
}
