
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

  // VIKTIGT: Ta bort specialhanteringen för handhållna enheter
  // Vi använder nu standardberäkningen för alla maskiner
  
  // Om maskinen har fördefinierade leasingMin/Max värden
  if (machine.leasingMin !== undefined && 
      machine.leasingMax !== undefined) {
    // Justera för aktuell leasingperiod relativt 60 månader (defaultperiod)
    const leasingMin60m = machine.leasingMin;
    const leasingMax60m = machine.leasingMax;
    
    // Skalfaktor baserat på vald leasingperiod vs 60 månader (defaultperiod)
    const defaultRate60m = 0.02095; // 60 månaders ränta
    const scaleFactor = leasingRate / defaultRate60m;
    
    console.log(`Skalfaktor för leasingperiod: ${scaleFactor} (rate: ${leasingRate}, 60m rate: ${defaultRate60m})`);
    
    // Skala värdena baserat på vald leasingperiod
    minLeasingCost = leasingMin60m * scaleFactor;
    defaultLeasingCost = (leasingMin60m + leasingMax60m) / 2 * scaleFactor; // defaultLeasingCost är mitten av min och max
    maxLeasingCost = leasingMax60m * scaleFactor;
    
    console.log(`Beräknade leasingvärden för ${machine.name} med rate ${leasingRate}:
      60m värden: min=${leasingMin60m}, max=${leasingMax60m}
      Skalade värden: min=${minLeasingCost}, default=${defaultLeasingCost}, max=${maxLeasingCost}
    `);
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
    // Sätt tröskeln vid 80% av vägen från min till default
    flatrateThreshold = minLeasingCost + (defaultLeasingCost - minLeasingCost) * 0.8;
    console.log(`Beräknar flatrate-tröskelvärde:
      minLeasingCost: ${minLeasingCost}
      defaultLeasingCost: ${defaultLeasingCost}
      maxLeasingCost: ${maxLeasingCost}
      flatrateThreshold (80% mellan min och default): ${flatrateThreshold}
    `);
  }

  return {
    min: minLeasingCost,
    max: maxLeasingCost,
    default: defaultLeasingCost,
    flatrateThreshold
  };
}
