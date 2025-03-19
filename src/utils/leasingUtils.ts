
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
  leasingRate: number,
  includeInsurance: boolean
): { min: number; max: number; default: number } {
  let baseLeasingMin: number;
  let baseLeasingMax: number;
  let baseLeasingDefault: number;
  
  // First check if we can use the predefined leasing range
  if (machine.leasingMin !== undefined && machine.leasingMax !== undefined) {
    baseLeasingMin = machine.leasingMin;
    baseLeasingMax = machine.leasingMax;
    baseLeasingDefault = machine.leasingMax; // Use max as default
    console.log(`Using predefined leasing range for ${machine.name}: ${baseLeasingMin} - ${baseLeasingMax}`);
  } 
  // Then check if we should use tariff-based calculation
  else if (leasingRate && LEASING_TARIFFS.some(t => Math.abs(t.Faktor - leasingRate * 100) < 0.1)) {
    // Find the closest matching tariff
    const closestTariff = LEASING_TARIFFS.reduce((prev, curr) => 
      Math.abs(curr.Faktor - leasingRate * 100) < Math.abs(prev.Faktor - leasingRate * 100) ? curr : prev
    );
    
    baseLeasingMax = calculateTariffBasedLeasingMax(machine.priceEur, closestTariff.Löptid);
    baseLeasingMin = Math.round(0.90 * baseLeasingMax);
    baseLeasingDefault = baseLeasingMax;
    
    console.log(`Calculated tariff-based leasing range for ${machine.name}: ${baseLeasingMin} - ${baseLeasingMax}`);
  }
  // Fall back to the original calculation method
  else {
    const minMultiplier = machine.minLeaseMultiplier;
    const maxMultiplier = machine.maxLeaseMultiplier;
    const defaultMultiplier = machine.maxLeaseMultiplier; // Use max as default
    
    baseLeasingMin = machinePriceSEK * leasingRate * minMultiplier;
    baseLeasingMax = machinePriceSEK * leasingRate * maxMultiplier;
    baseLeasingDefault = machinePriceSEK * leasingRate * defaultMultiplier;
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
  leasingRate: number,
  includeInsurance: boolean,
  leaseMultiplier: number
): number {
  let baseLeasingCost: number;
  
  if (machine.leasingMin !== undefined && machine.leasingMax !== undefined) {
    const leaseRange = machine.leasingMax - machine.leasingMin;
    baseLeasingCost = machine.leasingMin + leaseMultiplier * leaseRange;
    console.log(`Interpolated leasing cost for ${machine.name} at factor ${leaseMultiplier}: ${baseLeasingCost}`);
  } else {
    const actualMultiplier = machine.minLeaseMultiplier + 
      leaseMultiplier * 
      (machine.maxLeaseMultiplier - machine.minLeaseMultiplier);
    
    baseLeasingCost = machinePriceSEK * leasingRate * actualMultiplier;
    console.log(`Calculated leasing cost for ${machine.name} at multiplier ${actualMultiplier}: ${baseLeasingCost}`);
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
  
  const finalCost = baseLeasingCost + insuranceCost;
  console.log(`Final leasing cost: ${finalCost}`);
  return finalCost;
}
