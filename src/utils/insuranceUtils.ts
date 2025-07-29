
/**
 * @deprecated Use InsuranceEngine instead
 * Detta är en wrapper för bakåtkompatibilitet
 */

import { InsuranceEngine } from './core/InsuranceEngine';

export function calculateInsuranceCost(machinePriceSEK: number): number {
  return InsuranceEngine.calculateMonthlyCost(machinePriceSEK, true);
}

export function isInsuranceEnabled(selectedInsuranceId: string): boolean {
  return InsuranceEngine.isEnabled(selectedInsuranceId, 0);
}
