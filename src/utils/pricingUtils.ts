
import { roundToHundredEndingSix } from './formatUtils';

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
