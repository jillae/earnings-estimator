
/**
 * Utility functions for leasing calculations
 */
import { Machine } from '../data/machineData';
import { 
  LEASING_TARIFFS, 
  SHIPPING_COST_EUR_CREDITS, 
  SHIPPING_COST_EUR_NO_CREDITS, 
  CONSTANT_MULTIPLIER 
} from './constants';

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
  leaseDurationMonths: number,
  usesCredits: boolean
): number {
  const factor = getLeasingFactor(leaseDurationMonths);
  const shippingCost = usesCredits ? SHIPPING_COST_EUR_CREDITS : SHIPPING_COST_EUR_NO_CREDITS;
  
  if (factor !== undefined) {
    // The factor is now a decimal (e.g., 0.04566 instead of 4.566)
    const calculatedValue = Math.round((machinePriceEur + shippingCost) * CONSTANT_MULTIPLIER * factor);
    console.log(`Tariff calculation: (${machinePriceEur} + ${shippingCost}) * ${CONSTANT_MULTIPLIER} * ${factor} = ${calculatedValue}`);
    return calculatedValue;
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
  const leasingRateNum = typeof leasingRate === 'string' ? parseFloat(leasingRate) : leasingRate || 0;
  
  // Always use tariff-based calculation as specified in the requirements
  // Find the closest leasing period match
  const closestTariff = LEASING_TARIFFS.reduce((prev, curr) => 
    Math.abs(curr.Faktor - leasingRateNum) < Math.abs(prev.Faktor - leasingRateNum) ? curr : prev
  );
  
  // If we have specific machine leasingMin/Max values in the data, use those instead
  if (machine.leasingMin !== undefined && machine.leasingMax !== undefined) {
    console.log(`Using pre-defined leasing range for ${machine.name}: ${machine.leasingMin} - ${machine.leasingMax}`);
    const baseLeasingMin = machine.leasingMin;
    const baseLeasingMax = machine.leasingMax;
    const baseLeasingDefault = baseLeasingMax;
    
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
  
  // If no pre-defined values, calculate based on tariff
  const baseLeasingMax = calculateTariffBasedLeasingMax(machine.priceEur, closestTariff.Löptid, machine.usesCredits);
  const baseLeasingMin = Math.round(0.90 * baseLeasingMax); // 90% of max as required
  const baseLeasingDefault = baseLeasingMax;
  
  console.log(`Calculated tariff-based leasing range for ${machine.name}: ${baseLeasingMin} - ${baseLeasingMax}`);

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
  const leasingRateNum = typeof leasingRate === 'string' ? parseFloat(leasingRate) : leasingRate || 0;
  
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
