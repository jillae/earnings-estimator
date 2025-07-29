
/**
 * @deprecated Use SlaEngine and other centralized engines instead
 * Detta är en wrapper för bakåtkompatibilitet
 */

import { roundToHundredEndingSix } from './formatUtils';
import { SlaEngine } from './core/SlaEngine';
import { Machine } from '../data/machines/types';
import { SlaLevel } from './constants';
import { calculateTariffBasedLeasingMax } from './leasingTariffUtils';

/**
 * Beräknar kontantpris för en maskin baserat på EUR-pris, fraktkostnad och växelkurs
 */
export function calculateCashPrice(
  machinePriceEur: number, 
  shippingCostEur: number, 
  exchangeRate: number
): number {
  if (!machinePriceEur || isNaN(machinePriceEur) || !exchangeRate || isNaN(exchangeRate)) {
    return 0;
  }

  const totalEurPrice = machinePriceEur + shippingCostEur;
  const sekPrice = totalEurPrice * exchangeRate;
  
  // Avrunda till närmaste hundra slutande på 6
  return roundToHundredEndingSix(sekPrice);
}

/**
 * Beräknar leasingMax för 60 månader med försäkring 'Ja' som ett referensvärde
 * Detta används för SLA-kostnadsberäkningar
 */
export function calculateLeasingMax60mRef(
  machine: Machine,
  exchangeRate: number = 11.49260
): number {
  if (!machine || !machine.priceEur) {
    return 0;
  }

  // Använd den centrala tariffbaserade beräkningen för 60 månader
  const leasingMax60m = calculateTariffBasedLeasingMax(
    machine.priceEur,
    60, // Använd alltid 60 månader för SLA-beräkningar
    machine.usesCredits,
    exchangeRate
  );
  
  return leasingMax60m;
}

/**
 * @deprecated Use SlaEngine.calculateCost instead
 */
export function calculateSlaCost(
  machine: Machine,
  selectedSlaLevel: SlaLevel,
  leasingMax60mRef: number
): number {
  return SlaEngine.calculateCost(machine, selectedSlaLevel, leasingMax60mRef);
}
