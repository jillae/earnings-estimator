
/**
 * Utility functions for leasing calculations
 */
import { Machine } from '../data/machineData';
import { LEASING_TARIFFS, SHIPPING_COST_EUR, CONSTANT_MULTIPLIER } from './constants';

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
 */
export function calculateTariffBasedLeasingMax(
  machinePriceEur: number, 
  leaseDurationMonths: number
): number {
  const factor = getLeasingFactor(leaseDurationMonths);
  
  if (factor !== undefined) {
    return Math.round((machinePriceEur + SHIPPING_COST_EUR) * CONSTANT_MULTIPLIER * factor);
  } else {
    console.error(`No factor found for leasing duration ${leaseDurationMonths} months.`);
    return 0;
  }
}

export function calculateLeasingRange(
  machine: Machine,
  machinePriceSEK: number,
  leasingRate: number | string,
  includeInsurance: boolean
): { min: number; max: number; default: number } {
  // Ensure leasingRate is a number
  const leasingRateNum = typeof leasingRate === 'string' ? parseFloat(leasingRate) : leasingRate;
  
  let baseLeasingMin: number;
  let baseLeasingMax: number;
  let baseLeasingDefault: number;
  
  // Always use tariff-based calculation when possible
  // Find the closest leasing period match
  if (leasingRateNum) {
    const closestTariff = LEASING_TARIFFS.reduce((prev, curr) => 
      Math.abs(curr.Faktor - leasingRateNum * 100) < Math.abs(prev.Faktor - leasingRateNum * 100) ? curr : prev
    );
    
    baseLeasingMax = calculateTariffBasedLeasingMax(machine.priceEur, closestTariff.Löptid);
    baseLeasingMin = Math.round(0.90 * baseLeasingMax);
    baseLeasingDefault = baseLeasingMax;
    
    console.log(`Calculated tariff-based leasing range for ${machine.name}: ${baseLeasingMin} - ${baseLeasingMax}`);
  }
  // Fall back to the original calculation method if no tariff match found
  else {
    const minMultiplier = machine.minLeaseMultiplier;
    const maxMultiplier = machine.maxLeaseMultiplier;
    const defaultMultiplier = machine.maxLeaseMultiplier; // Use max as default
    
    baseLeasingMin = machinePriceSEK * leasingRateNum * minMultiplier;
    baseLeasingMax = machinePriceSEK * leasingRateNum * maxMultiplier;
    baseLeasingDefault = machinePriceSEK * leasingRateNum * defaultMultiplier;
    console.log(`Calculated leasing range for ${machine.name}: ${baseLeasingMin} - ${baseLeasingMax}`);
  }

  let insuranceCost = 0;
  if (includeInsurance) {
    let insuranceRate = 0.015;
    if (machinePriceSEK <= 10000) {
      insuranceRate = 0.04;
    } else if (machinePriceSEK <= 20000) {
      insuranceRate = 0.03;
    } else if (machinePriceSEK <= 50000) {
      insuranceRate = 0.025;
    }
    
    insuranceCost = machinePriceSEK * insuranceRate / 12;
    console.log(`Adding insurance cost: ${insuranceCost}`);
  }
  
  const result = {
    min: baseLeasingMin,
    max: baseLeasingMax,
    default: baseLeasingDefault + insuranceCost
  };
  
  console.log("Final leasing range:", result);
  return result;
}

export function calculateLeasingCost(
  machine: Machine,
  machinePriceSEK: number,
  leasingRate: number | string,
  includeInsurance: boolean,
  leaseMultiplier: number
): number {
  // Ensure leasingRate is a number
  const leasingRateNum = typeof leasingRate === 'string' ? parseFloat(leasingRate) : leasingRate;
  
  // Get the dynamic leasing range
  const leasingRange = calculateLeasingRange(machine, machinePriceSEK, leasingRateNum, false);
  let baseLeasingCost: number;
  
  // Use the dynamically calculated leasingMax and leasingMin
  const leaseRange = leasingRange.max - leasingRange.min;
  baseLeasingCost = leasingRange.min + leaseMultiplier * leaseRange;
  console.log(`Interpolated leasing cost for ${machine.name} at factor ${leaseMultiplier}: ${baseLeasingCost}`);
  
  let insuranceCost = 0;
  if (includeInsurance) {
    let insuranceRate = 0.015;
    if (machinePriceSEK <= 10000) {
      insuranceRate = 0.04;
    } else if (machinePriceSEK <= 20000) {
      insuranceRate = 0.03;
    } else if (machinePriceSEK <= 50000) {
      insuranceRate = 0.025;
    }
    
    insuranceCost = machinePriceSEK * insuranceRate / 12;
    console.log(`Adding insurance cost: ${insuranceCost}`);
  }
  
  const finalCost = baseLeasingCost + insuranceCost;
  console.log(`Final leasing cost: ${finalCost}`);
  return finalCost;
}
