
/**
 * Utility functions for calculating leasing ranges
 */
import { Machine } from '../data/machineData';
import { FLATRATE_THRESHOLD_PERCENTAGE } from './constants';
import { calculateTariffBasedLeasingMax } from './leasingTariffUtils';

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
  
  // Always use tariff-based calculation as specified in the requirements
  // Find the closest leasing period match
  const closestTariff = LEASING_TARIFFS.reduce((prev, curr) => 
    Math.abs(curr.Faktor - leasingRateNum * 100) < Math.abs(prev.Faktor - leasingRateNum * 100) ? curr : prev
  );
  
  // If we have specific machine leasingMin/Max values in the data, use those instead
  if (machine.leasingMin !== undefined && machine.leasingMax !== undefined) {
    console.log(`Using pre-defined leasing range for ${machine.name}: ${machine.leasingMin} - ${machine.leasingMax}`);
    const baseLeasingMin = machine.leasingMin;
    const baseLeasingMax = machine.leasingMax;
    const baseLeasingDefault = baseLeasingMax;
    
    let insuranceCost = 0;
    if (includeInsurance) {
      insuranceCost = calculateInsuranceCost(machinePriceSEK);
      console.log(`Adding insurance cost: ${insuranceCost}`);
    }
    
    // Skapa resultatobjektet
    let result: LeasingRange = {
      min: baseLeasingMin,
      max: baseLeasingMax,
      default: baseLeasingDefault + insuranceCost
    };
    
    // Lägg till flatrateThreshold för maskiner som använder credits
    if (machine.usesCredits) {
      // Sätt tröskeln vid 80% av vägen från min till max
      const threshold = baseLeasingMin + (baseLeasingMax - baseLeasingMin) * FLATRATE_THRESHOLD_PERCENTAGE;
      console.log(`Flatrate threshold calculated: ${threshold}`);
      result.flatrateThreshold = threshold;
    }
    
    console.log("Final leasing range:", result);
    return result;
  }
  
  // Calculate exchange rate to convert EUR to SEK
  const exchangeRate = machinePriceSEK / machine.priceEur;
  
  // If no pre-defined values, calculate based on tariff
  const baseLeasingMax = calculateTariffBasedLeasingMax(
    machine.priceEur, 
    closestTariff.Löptid, 
    machine.usesCredits,
    exchangeRate
  );
  const baseLeasingMin = Math.round(0.90 * baseLeasingMax); // 90% of max as required
  const baseLeasingDefault = baseLeasingMax;
  
  console.log(`Calculated tariff-based leasing range for ${machine.name}: ${baseLeasingMin} - ${baseLeasingMax}`);

  let insuranceCost = 0;
  if (includeInsurance) {
    insuranceCost = calculateInsuranceCost(machinePriceSEK);
    console.log(`Adding insurance cost: ${insuranceCost}`);
  }
  
  // Skapa resultatobjektet
  let result: LeasingRange = {
    min: baseLeasingMin,
    max: baseLeasingMax,
    default: baseLeasingDefault + insuranceCost
  };
  
  // Lägg till flatrateThreshold för maskiner som använder credits
  if (machine.usesCredits) {
    // Sätt tröskeln vid 80% av vägen från min till max
    const threshold = baseLeasingMin + (baseLeasingMax - baseLeasingMin) * FLATRATE_THRESHOLD_PERCENTAGE;
    console.log(`Flatrate threshold calculated: ${threshold}`);
    result.flatrateThreshold = threshold;
  }
  
  console.log("Final leasing range:", result);
  return result;
}

/**
 * Helper function to calculate insurance cost
 */
function calculateInsuranceCost(machinePriceSEK: number): number {
  let insuranceRate = 0.015;
  if (machinePriceSEK <= 10000) {
    insuranceRate = 0.04;
  } else if (machinePriceSEK <= 20000) {
    insuranceRate = 0.03;
  } else if (machinePriceSEK <= 50000) {
    insuranceRate = 0.025;
  }
  
  return machinePriceSEK * insuranceRate / 12;
}

// Import needed for the closestTariff calculation
import { LEASING_TARIFFS } from './constants';
