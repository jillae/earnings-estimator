
import { roundToHundredEndingSix } from './formatUtils';
import { SHIPPING_COST_EUR_CREDITS, SHIPPING_COST_EUR_NO_CREDITS } from './constants';
import { Machine } from '../data/machines/types';
import { SLA_PERCENT_NO_CREDITS, SLA_PERCENT_GULD, SlaLevel } from './constants';
import { LEASING_TARIFFS } from './constants';

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

  // Om vi har fördefinierade leasingMax för 60m, använd det direkt
  if (machine.leasingMax) {
    console.log(`Använder fördefinierat leasingMax60mRef för ${machine.name}: ${machine.leasingMax}`);
    return machine.leasingMax;
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
  console.log(`Beräknar SLA-kostnad:
    Maskin: ${machine.name}
    SLA-nivå: ${selectedSlaLevel}
    LeasingMax60mRef: ${leasingMax60mRef}
    Flatrate Amount: ${machine.flatrateAmount}
    UsesCredits: ${machine.usesCredits}
  `);

  // Brons är alltid gratis
  if (selectedSlaLevel === 'Brons') {
    return 0;
  }
  
  // För maskiner som använder credits
  if (machine.usesCredits) {
    // För Silver, använd exakt flatrateAmount
    if (selectedSlaLevel === 'Silver' && machine.flatrateAmount) {
      console.log(`Använder exakt flatrateAmount för Silver SLA: ${machine.flatrateAmount}`);
      return machine.flatrateAmount;
    }
    
    // För Guld, använd alltid samma procent av leasingMax60mRef
    if (selectedSlaLevel === 'Guld') {
      const goldCost = Math.round(leasingMax60mRef * SLA_PERCENT_GULD);
      console.log(`Beräknad Guld SLA-kostnad: ${goldCost}`);
      return goldCost;
    }
  } 
  // För maskiner som INTE använder credits (handhållna och special)
  else {
    // Handhållna: GVL, EVRL, XLR8, Base Station, Lunula
    // För Silver, använd procentandel av leasingMax60mRef
    if (selectedSlaLevel === 'Silver') {
      const silverCost = Math.round(leasingMax60mRef * SLA_PERCENT_NO_CREDITS.Silver);
      console.log(`Beräknad Silver SLA-kostnad (utan credits): ${silverCost}`);
      return silverCost;
    }
    
    // För Guld, använd högre procent av leasingMax60mRef
    if (selectedSlaLevel === 'Guld') {
      const goldCost = Math.round(leasingMax60mRef * SLA_PERCENT_GULD);
      console.log(`Beräknad Guld SLA-kostnad: ${goldCost}`);
      return goldCost;
    }
  }
  
  return 0; // Fallback om inget annat matchade
}
