
/**
 * Utility functions for calculating leasing ranges
 */
import { Machine } from '../data/machineData';
import { FLATRATE_THRESHOLD_PERCENTAGE, LEASING_TARIFFS } from './constants';
import { calculateTariffBasedLeasingMax } from './leasingTariffUtils';
import { roundToHundredEndingSix } from './formatUtils';
import { calculateInsuranceCost } from './insuranceUtils';

/**
 * Interface for the return value from calculateLeasingRange
 */
export interface LeasingRange {
  min: number;
  max: number;
  default: number;
  flatrateThreshold?: number;
}

/**
 * Calculates the leasing range (min, max, default) for a machine
 */
export function calculateLeasingRange(
  machine: Machine,
  machinePriceSEK: number,
  leasingRate: number | string,
  includeInsurance: boolean
): LeasingRange {
  // Ensure leasingRate is a number
  const leasingRateNum = typeof leasingRate === 'string' ? parseFloat(leasingRate) : leasingRate || 0;
  
  // Säkerställ att machinePriceSEK är ett giltigt värde
  const validMachinePriceSEK = machinePriceSEK || 0;
  
  // Always use tariff-based calculation as specified in the requirements
  // Find the closest leasing period match
  const closestTariff = LEASING_TARIFFS.reduce((prev, curr) => 
    Math.abs(curr.Faktor - leasingRateNum * 100) < Math.abs(prev.Faktor - leasingRateNum * 100) ? curr : prev
  );
  
  // Calculate exchange rate to convert EUR to SEK
  const exchangeRate = machine.priceEur > 0 ? validMachinePriceSEK / machine.priceEur : 11.49260;
  
  // Use the tariff-based calculation for all machines
  const baseLeasingMax = calculateTariffBasedLeasingMax(
    machine.priceEur, 
    closestTariff.Löptid, 
    machine.usesCredits,
    exchangeRate
  );
  
  // Avrunda till närmaste 100-tal som slutar på 6
  const roundedLeasingMax = roundToHundredEndingSix(baseLeasingMax);
  const roundedLeasingMin = roundToHundredEndingSix(Math.round(0.90 * roundedLeasingMax)); // 90% av max som krav
  const roundedLeasingDefault = roundedLeasingMax;
  
  console.log(`Calculated tariff-based leasing range for ${machine.name}: ${roundedLeasingMin} - ${roundedLeasingMax}`);

  let insuranceCost = 0;
  if (includeInsurance) {
    insuranceCost = calculateInsuranceCost(validMachinePriceSEK);
    console.log(`Adding insurance cost: ${insuranceCost}`);
  }
  
  // Skapa resultatobjektet
  let result: LeasingRange = {
    min: roundedLeasingMin,
    max: roundedLeasingMax,
    default: roundedLeasingDefault + insuranceCost
  };
  
  // Lägg till flatrateThreshold för maskiner som använder credits
  if (machine.usesCredits) {
    // Sätt tröskeln vid 80% av vägen från min till max
    const threshold = roundedLeasingMin + (roundedLeasingMax - roundedLeasingMin) * FLATRATE_THRESHOLD_PERCENTAGE;
    console.log(`Flatrate threshold calculated: ${threshold}`);
    result.flatrateThreshold = roundToHundredEndingSix(threshold);
  }
  
  console.log("Final leasing range:", result);
  return result;
}

