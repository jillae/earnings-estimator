/**
 * Centraliserad SLA-hantering
 */

import { SLA_PERCENT_SILVER, SLA_PERCENT_GULD } from '../constants';
import type { SlaLevel } from '../constants';
import type { Machine } from '@/data/machines/types';

export class SlaEngine {
  /**
   * Beräknar SLA-kostnad för given nivå
   */
  static calculateCost(
    machine: Machine | undefined, 
    slaLevel: SlaLevel, 
    leasingMax60mRef: number
  ): number {
    if (!machine || !leasingMax60mRef) return 0;

    switch (slaLevel) {
      case 'Brons':
        return 0; // Brons är alltid gratis
      case 'Silver':
        return leasingMax60mRef * SLA_PERCENT_SILVER;
      case 'Guld':
        return leasingMax60mRef * SLA_PERCENT_GULD;
      default:
        return 0;
    }
  }

  /**
   * Hämtar alla SLA-kostnader för en maskin
   */
  static getAllCosts(machine: Machine | undefined, leasingMax60mRef: number) {
    return {
      Brons: this.calculateCost(machine, 'Brons', leasingMax60mRef),
      Silver: this.calculateCost(machine, 'Silver', leasingMax60mRef),
      Guld: this.calculateCost(machine, 'Guld', leasingMax60mRef)
    };
  }

  /**
   * Kontrollerar om SLA-nivå är giltig
   */
  static isValidLevel(level: string): level is SlaLevel {
    return ['Brons', 'Silver', 'Guld'].includes(level);
  }

  /**
   * Hämtar standardnivå för SLA
   */
  static getDefaultLevel(): SlaLevel {
    return 'Brons';
  }

  /**
   * Hämtar procentsats för SLA-nivå
   */
  static getPercentage(slaLevel: SlaLevel): number {
    switch (slaLevel) {
      case 'Brons':
        return 0;
      case 'Silver':
        return SLA_PERCENT_SILVER;
      case 'Guld':
        return SLA_PERCENT_GULD;
      default:
        return 0;
    }
  }
}