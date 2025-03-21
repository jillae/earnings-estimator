
/**
 * Utility functions for handling leasing tariffs
 */
import { LEASING_TARIFFS, SHIPPING_COST_EUR_CREDITS, SHIPPING_COST_EUR_NO_CREDITS } from './constants';
import { roundToHundredEndingSix } from './formatUtils';

/**
 * Gets the leasing factor based on leasing duration in months
 */
export function getLeasingFactor(leaseDurationMonths: number): number | undefined {
  const tariffEntry = LEASING_TARIFFS.find(entry => entry.Löptid === leaseDurationMonths);
  return tariffEntry?.Faktor;
}

/**
 * Calculates the maximum leasing cost based on machine price and leasing duration
 * This is the central function for determining the maximum leasing cost
 * 
 * Formula: machinePriceSEK * tariff% = leasingMax
 */
export function calculateTariffBasedLeasingMax(
  machinePriceEur: number, 
  leaseDurationMonths: number,
  usesCredits: boolean,
  exchangeRate: number = 11.49260
): number {
  if (!machinePriceEur || isNaN(machinePriceEur)) {
    return 0;
  }
  
  const factor = getLeasingFactor(leaseDurationMonths);
  const shippingCost = usesCredits ? SHIPPING_COST_EUR_CREDITS : SHIPPING_COST_EUR_NO_CREDITS;
  
  if (factor !== undefined) {
    // Convert EUR to SEK first
    const totalPriceSEK = (machinePriceEur + shippingCost) * exchangeRate;
    
    // Apply tariff percentage (factor is already a percentage value)
    const calculatedValue = Math.round(totalPriceSEK * factor / 100);
    
    console.log(`Tariff calculation: ${totalPriceSEK} SEK * ${factor}% = ${calculatedValue}`);
    return roundToHundredEndingSix(calculatedValue);
  } else {
    console.error(`No factor found for leasing duration ${leaseDurationMonths} months.`);
    return 0;
  }
}
