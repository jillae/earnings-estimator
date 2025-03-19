
/**
 * Utility functions for leasing calculations
 */
import { Machine } from '../data/machineData';

export function calculateLeasingRange(
  machine: Machine,
  machinePriceSEK: number,
  leasingRate: number,
  includeInsurance: boolean
): { min: number; max: number; default: number } {
  let baseLeasingMin: number;
  let baseLeasingMax: number;
  let baseLeasingDefault: number;
  
  if (machine.leasingMin !== undefined && machine.leasingMax !== undefined) {
    baseLeasingMin = machine.leasingMin;
    baseLeasingMax = machine.leasingMax;
    baseLeasingDefault = machine.leasingMax;
    console.log(`Using predefined leasing range for ${machine.name}: ${baseLeasingMin} - ${baseLeasingMax}`);
  } else {
    const minMultiplier = machine.minLeaseMultiplier;
    const maxMultiplier = machine.maxLeaseMultiplier;
    const defaultMultiplier = machine.maxLeaseMultiplier;
    
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
