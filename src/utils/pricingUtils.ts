
import { roundToHundredEndingSix } from './formatUtils';
import { SHIPPING_COST_EUR_CREDITS, SHIPPING_COST_EUR_NO_CREDITS } from './constants';
import { Machine } from '../data/machines/types';
import { SLA_PERCENT_SILVER, SLA_PERCENT_GULD, SlaLevel } from './constants';
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

  console.log(`Beräkning av leasingMax60mRef för ${machine.name || 'okänd maskin'}:
    maskinId: ${machine.id || 'okänt ID'}
    priceEur: ${machine.priceEur}
    exchangeRate: ${exchangeRate}
    usesCredits: ${machine.usesCredits}
  `);
  
  // Använd den centrala tariffbaserade beräkningen för 60 månader
  const leasingMax60m = calculateTariffBasedLeasingMax(
    machine.priceEur,
    60, // Använd alltid 60 månader för SLA-beräkningar
    machine.usesCredits,
    exchangeRate
  );
  
  console.log(`Beräkningen gav leasingMax60mRef = ${leasingMax60m} SEK för ${machine.name}`);
  
  return leasingMax60m;
}

/**
 * Beräknar SLA-kostnad baserat på maskin och leasingMax60mRef
 * 
 * Standardregler:
 * - Brons: 0 kr (alltid gratis)
 * - Silver: 25% av leasingMax60mRef (hälften av Guld)
 * - Guld: 50% av leasingMax60mRef
 */
export function calculateSlaCost(
  machine: Machine,
  selectedSlaLevel: SlaLevel,
  leasingMax60mRef: number
): number {
  console.log(`Beräknar SLA-kostnad för ${machine?.name || 'okänd maskin'}:
    maskinId: ${machine?.id || 'okänt ID'}
    selectedSlaLevel: ${selectedSlaLevel}
    leasingMax60mRef: ${leasingMax60mRef} SEK
  `);
  
  // Brons är alltid gratis
  if (selectedSlaLevel === 'Brons') {
    console.log(`SLA Brons är alltid gratis, returnerar 0 SEK`);
    return 0;
  }
  
  // För Silver, använd 25% av leasingMax60mRef
  if (selectedSlaLevel === 'Silver') {
    const silverCost = Math.round(leasingMax60mRef * SLA_PERCENT_SILVER);
    console.log(`Beräknad Silver SLA-kostnad för ${machine?.name || 'okänd maskin'}: ${silverCost} (25% av ${leasingMax60mRef})`);
    return silverCost;
  }
  
  // För Guld, använd 50% av leasingMax60mRef
  if (selectedSlaLevel === 'Guld') {
    const goldCost = Math.round(leasingMax60mRef * SLA_PERCENT_GULD);
    console.log(`Beräknad Guld SLA-kostnad för ${machine?.name || 'okänd maskin'}: ${goldCost} (50% av ${leasingMax60mRef})`);
    return goldCost;
  }
  
  // Fallback - ska aldrig nås om ovanstående logik är korrekt
  console.warn(`Fallback i SLA-beräkning - inget matchade för ${machine?.name || 'okänd maskin'}, ${selectedSlaLevel}`);
  return 0;
}
