
import { Machine } from '../data/machines/types';
import { calculateInsuranceCost, isInsuranceEnabled } from './insuranceUtils';
import { roundToHundredEndingSix } from './formatUtils';

export interface LeasingRange {
  min: number;
  max: number;
  default: number;
  flatrateThreshold?: number;
}

/**
 * Calculates the possible leasing range (min, max, default) for a machine
 */
export function calculateLeasingRange(
  machine: Machine,
  machinePriceSEK: number,
  leasingRate: number,
  includeInsurance: boolean
): LeasingRange {
  // Sanity check
  if (!machine || machinePriceSEK <= 0 || leasingRate <= 0) {
    console.warn('Invalid input for leasing range calculation', { machine, machinePriceSEK, leasingRate });
    return { min: 0, max: 0, default: 0 };
  }

  let minLeasingCost: number;
  let maxLeasingCost: number;
  let defaultLeasingCost: number;

  if (machine.leasingMin && machine.leasingMax) {
    // Om maskinen har fördefinierade leasingMin/Max värden
    minLeasingCost = machine.leasingMin;
    maxLeasingCost = machine.leasingMax;
    
    // Beräkna default baserat på maskinens defaultLeaseMultiplier
    const defaultMultiplier = machine.defaultLeaseMultiplier || 0.025;
    
    // Använd linjär interpolation för default, baserat på maskinens defaultLeaseMultiplier
    // defaultLeaseMultiplier ska ligga mellan minLeaseMultiplier och maxLeaseMultiplier
    // och används för att beräkna defaultLeasingCost mellan min och max
    if (machine.minLeaseMultiplier !== undefined && machine.maxLeaseMultiplier !== undefined) {
      const normalizedDefaultMultiplier = 
        (defaultMultiplier - machine.minLeaseMultiplier) / 
        (machine.maxLeaseMultiplier - machine.minLeaseMultiplier);
        
      defaultLeasingCost = minLeasingCost + normalizedDefaultMultiplier * (maxLeasingCost - minLeasingCost);
    } else {
      // Om saknas, använd 50% mellan min och max
      defaultLeasingCost = minLeasingCost + 0.5 * (maxLeasingCost - minLeasingCost);
    }
  } else {
    // Beräkna baserat på maskinpris, leasingränta och multiplikatorer
    minLeasingCost = machinePriceSEK * leasingRate * (machine.minLeaseMultiplier || 0.018);
    maxLeasingCost = machinePriceSEK * leasingRate * (machine.maxLeaseMultiplier || 0.032);
    defaultLeasingCost = machinePriceSEK * leasingRate * (machine.defaultLeaseMultiplier || 0.025);
  }

  // Avrunda alla värden till närmaste 100-tal som slutar på 6
  minLeasingCost = roundToHundredEndingSix(minLeasingCost);
  maxLeasingCost = roundToHundredEndingSix(maxLeasingCost);
  defaultLeasingCost = roundToHundredEndingSix(defaultLeasingCost);

  // Lägg till försäkring om det är aktiverat
  if (includeInsurance && isInsuranceEnabled(machine.id)) {
    const insuranceCost = calculateInsuranceCost(machinePriceSEK);
    console.log(`Adding insurance cost to leasing range: ${insuranceCost}`);
    minLeasingCost += insuranceCost;
    maxLeasingCost += insuranceCost;
    defaultLeasingCost += insuranceCost;
  }

  // Beräkna flatrate-tröskelvärdet för maskiner som använder krediter
  let flatrateThreshold;
  if (machine.usesCredits) {
    // Sätt tröskeln vid 80% av vägen från min till max
    flatrateThreshold = minLeasingCost + (maxLeasingCost - minLeasingCost) * 0.8;
  }

  return {
    min: minLeasingCost,
    max: maxLeasingCost,
    default: defaultLeasingCost,
    flatrateThreshold
  };
}
