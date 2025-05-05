
/**
 * Utility functions for handling leasing tariffs
 */
import { 
  LEASING_TARIFFS_2024, 
  LEASING_TARIFFS_2025, 
  SHIPPING_COST_EUR_CREDITS, 
  SHIPPING_COST_EUR_NO_CREDITS,
  LEASING_TARIFFS
} from './constants';
import { roundToHundredEndingSix } from './formatUtils';

// Aktuella tariffvärden som används (kan uppdateras via admin)
// Använder LEASING_TARIFFS från constants.ts för konsekvent beteende
let currentTariffs = LEASING_TARIFFS;

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
  // Kontrollera först exakt match på id eller Löptid
  const tariffEntry = currentTariffs.find(entry => entry.id === leaseDurationMonths.toString() || entry.Löptid === leaseDurationMonths);
  
  // Säkerställ att vi loggar vad vi hittar för debugging
  console.log(`Leasing factor för ${leaseDurationMonths} månader: ${tariffEntry?.rate || 'HITTADES INTE!'}`);
  
  return tariffEntry?.rate;
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
  
  // DEBUG: Logga ingångsvärden för att spåra problem med specifika maskiner
  console.log(`calculateTariffBasedLeasingMax INPUTS:
    machinePriceEur: ${machinePriceEur}
    leaseDurationMonths: ${leaseDurationMonths}
    usesCredits: ${usesCredits}
    exchangeRate: ${exchangeRate}
  `);
  
  const factor = getLeasingFactor(leaseDurationMonths);
  const shippingCost = usesCredits ? SHIPPING_COST_EUR_CREDITS : SHIPPING_COST_EUR_NO_CREDITS;
  
  if (factor !== undefined) {
    // Convert EUR to SEK first
    const totalPriceSEK = (machinePriceEur + shippingCost) * exchangeRate;
    
    // Apply tariff percentage - factor is already in decimal form, no need to divide by 100
    const calculatedValue = Math.round(totalPriceSEK * factor);
    
    // FELSÖKNING: Rikare loggning för handhållna enheter
    if (['gvl', 'evrl', 'xlr8'].includes(String(machinePriceEur)) || typeof machinePriceEur === 'object') {
      console.log(`VARNING: machinePriceEur har ett oväntat värde för en handhållen enhet: ${machinePriceEur}, typeof: ${typeof machinePriceEur}`);
    }
    
    // Säkerställ att vi inte returnerar låga felaktiga värden
    if (calculatedValue < 500 && machinePriceEur > 1000) {
      console.error(`VARNING: Orimligt lågt beräknat värde (${calculatedValue}) för maskin med pris ${machinePriceEur} EUR`);
    }
    
    console.log(`Tariff calculation: ${machinePriceEur} EUR + ${shippingCost} EUR shipping = ${totalPriceSEK} SEK * ${factor} = ${calculatedValue}`);
    return roundToHundredEndingSix(calculatedValue);
  } else {
    console.error(`No factor found for leasing duration ${leaseDurationMonths} months.`);
    return 0;
  }
}
