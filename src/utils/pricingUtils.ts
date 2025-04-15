
import { roundToHundredEndingSix } from './formatUtils';
import { SHIPPING_COST_EUR_CREDITS, SHIPPING_COST_EUR_NO_CREDITS, LEASING_TARIFFS } from './constants';
import { Machine } from '../data/machines/types';
import { SLA_PERCENT_NO_CREDITS, SLA_PERCENT_GULD, SlaLevel } from './constants';

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

  // Hitta 60-månaders tariff
  const tariff60m = LEASING_TARIFFS.find(t => t.id === "60");
  if (!tariff60m) {
    console.error("60-månaders tariff hittades inte");
    return 0;
  }

  // Bestäm frakt baserat på om maskinen använder credits
  const shippingCostEur = machine.usesCredits ? SHIPPING_COST_EUR_CREDITS : SHIPPING_COST_EUR_NO_CREDITS;
  
  // Beräkna totalt SEK-pris
  const totalPriceSEK = (machine.priceEur + shippingCostEur) * exchangeRate;
  
  // Applicera tariff för att få leasingMax
  const leasingMax60m = totalPriceSEK * (tariff60m.rate / 100);
  
  // Avrunda till närmaste hundra slutande på 6
  return roundToHundredEndingSix(leasingMax60m);
}

/**
 * Beräknar SLA-kostnad baserat på maskin, vald SLA-nivå och referensvärdet
 */
export function calculateSlaCost(
  machine: Machine,
  selectedSlaLevel: SlaLevel,
  leasingMax60mRef: number
): number {
  // Brons är alltid gratis
  if (selectedSlaLevel === 'Brons') {
    return 0;
  }
  
  // För Guld, använd alltid samma procent oavsett maskintyp
  if (selectedSlaLevel === 'Guld') {
    return Math.round(leasingMax60mRef * SLA_PERCENT_GULD);
  }
  
  // För Silver beror det på om maskinen använder credits eller inte
  if (selectedSlaLevel === 'Silver') {
    // För kreditmaskiner, använd flatrateAmount som SLA-kostnad
    if (machine.usesCredits && machine.flatrateAmount) {
      return machine.flatrateAmount;
    }
    
    // För maskiner utan credits, använd procentandel av leasingMax60mRef
    return Math.round(leasingMax60mRef * SLA_PERCENT_NO_CREDITS.Silver);
  }
  
  return 0; // Fallback om inget annat matchade
}
