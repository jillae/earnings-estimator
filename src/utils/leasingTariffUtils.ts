
/**
 * Utility functions for handling leasing tariffs
 */
import { 
  LEASING_TARIFFS_2024, 
  LEASING_TARIFFS_2025, 
  SHIPPING_COST_EUR_CREDITS, 
  SHIPPING_COST_EUR_NO_CREDITS 
} from './constants';
import { roundToHundredEndingSix } from './formatUtils';

// Aktuella tariffvärden som används (kan uppdateras via admin)
let currentTariffs = LEASING_TARIFFS_2024;

/**
 * Uppdaterar vilken tariff som används (2024 eller 2025)
 */
export function setActiveTariffYear(use2025: boolean) {
  currentTariffs = use2025 ? LEASING_TARIFFS_2025 : LEASING_TARIFFS_2024;
}

/**
 * Gets the leasing factor based on leasing duration in months
 */
export function getLeasingFactor(leaseDurationMonths: number): number | undefined {
  const tariffEntry = currentTariffs.find(entry => entry.id === leaseDurationMonths.toString() || entry.Löptid === leaseDurationMonths);
  return tariffEntry?.rate || tariffEntry?.Faktor;
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
