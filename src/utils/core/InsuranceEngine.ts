/**
 * Centraliserad försäkringshantering
 */

import { INSURANCE_RATES } from '../constants';

export class InsuranceEngine {
  /**
   * Beräknar försäkringskostnad baserat på maskinvärde
   */
  static calculateCost(machineValueSEK: number): number {
    if (machineValueSEK <= 10000) {
      return machineValueSEK * INSURANCE_RATES.RATE_10K_OR_LESS;
    } else if (machineValueSEK <= 20000) {
      return machineValueSEK * INSURANCE_RATES.RATE_20K_OR_LESS;
    } else if (machineValueSEK <= 50000) {
      return machineValueSEK * INSURANCE_RATES.RATE_50K_OR_LESS;
    } else {
      return machineValueSEK * INSURANCE_RATES.RATE_ABOVE_50K;
    }
  }

  /**
   * Hämtar försäkringssats för givet maskinvärde
   */
  static getRate(machineValueSEK: number): number {
    if (machineValueSEK <= 10000) {
      return INSURANCE_RATES.RATE_10K_OR_LESS;
    } else if (machineValueSEK <= 20000) {
      return INSURANCE_RATES.RATE_20K_OR_LESS;
    } else if (machineValueSEK <= 50000) {
      return INSURANCE_RATES.RATE_50K_OR_LESS;
    } else {
      return INSURANCE_RATES.RATE_ABOVE_50K;
    }
  }

  /**
   * Kontrollerar om försäkring är aktiverad för given maskin och inställningar
   */
  static isEnabled(selectedInsuranceId: string, machineValueSEK: number): boolean {
    return selectedInsuranceId === 'yes' && machineValueSEK > 0;
  }

  /**
   * Beräknar månatlig försäkringskostnad
   */
  static calculateMonthlyCost(machineValueSEK: number, isEnabled: boolean): number {
    if (!isEnabled) return 0;
    
    const annualCost = this.calculateCost(machineValueSEK);
    return annualCost / 12;
  }
}