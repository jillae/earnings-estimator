import { VAT_RATE, WORKING_DAYS_PER_MONTH, MONTHS_PER_YEAR, FLATRATE_THRESHOLD, Machine } from '../data/machineData';
import { getExchangeRate } from './exchangeRate';

export function formatCurrency(amount: number, shouldRound: boolean = true): string {
  let displayAmount = amount;
  
  // Only round if shouldRound is true
  if (shouldRound) {
    displayAmount = Math.round(amount / 500) * 500;
  }
  
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(displayAmount);
}

export async function fetchExchangeRate(): Promise<number> {
  try {
    const rate = await getExchangeRate('EUR', 'SEK');
    return rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 11.49260; // Default EUR to SEK rate if API fails
  }
}

export function calculateMachinePriceSEK(machine: Machine, exchangeRate: number): number {
  return machine.priceEur * exchangeRate;
}

export function calculateLeasingRange(
  machine: Machine,
  machinePriceSEK: number,
  leasingRate: number,
  includeInsurance: boolean
): { min: number; max: number; default: number } {
  // Om leasingMin och leasingMax finns, använd dem direkt utan modifikation
  let baseLeasingMin: number;
  let baseLeasingMax: number;
  let baseLeasingDefault: number;
  
  if (machine.leasingMin !== undefined && machine.leasingMax !== undefined) {
    baseLeasingMin = machine.leasingMin;
    baseLeasingMax = machine.leasingMax;
    baseLeasingDefault = (machine.leasingMin + machine.leasingMax) / 2;
    console.log(`Using predefined leasing range for ${machine.name}: ${baseLeasingMin} - ${baseLeasingMax}`);
  } else {
    // Annars beräkna från multiplikatorer
    const minMultiplier = machine.minLeaseMultiplier;
    const maxMultiplier = machine.maxLeaseMultiplier;
    const defaultMultiplier = machine.defaultLeaseMultiplier;
    
    baseLeasingMin = machinePriceSEK * leasingRate * minMultiplier;
    baseLeasingMax = machinePriceSEK * leasingRate * maxMultiplier;
    baseLeasingDefault = machinePriceSEK * leasingRate * defaultMultiplier;
    console.log(`Calculated leasing range for ${machine.name}: ${baseLeasingMin} - ${baseLeasingMax}`);
  }

  // Add insurance if selected
  let insuranceCost = 0;
  if (includeInsurance) {
    // Determine insurance rate based on machine price
    let insuranceRate = 0.015; // Default for very expensive machines
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
    min: baseLeasingMin + insuranceCost,
    max: baseLeasingMax + insuranceCost,
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
    // Om leasingMin och leasingMax finns, interpolera mellan dem exakt
    const leaseRange = machine.leasingMax - machine.leasingMin;
    baseLeasingCost = machine.leasingMin + leaseMultiplier * leaseRange;
    console.log(`Interpolated leasing cost for ${machine.name} at factor ${leaseMultiplier}: ${baseLeasingCost}`);
  } else {
    // Annars beräkna från multiplikatorer och interpolera
    const actualMultiplier = machine.minLeaseMultiplier + 
      leaseMultiplier * 
      (machine.maxLeaseMultiplier - machine.minLeaseMultiplier);
    
    baseLeasingCost = machinePriceSEK * leasingRate * actualMultiplier;
    console.log(`Calculated leasing cost for ${machine.name} at multiplier ${actualMultiplier}: ${baseLeasingCost}`);
  }
  
  // Only round for display, not for calculations
  const calculationBaseLeasingCost = baseLeasingCost;
  
  // Add insurance if selected
  let insuranceCost = 0;
  if (includeInsurance) {
    // Determine insurance rate based on machine price
    let insuranceRate = 0.015; // Default for very expensive machines
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
  
  const finalCost = calculationBaseLeasingCost + insuranceCost;
  console.log(`Final leasing cost: ${finalCost}`);
  return finalCost;
}

export function calculateCreditPrice(machine: any, leasingCost: number): number {
  // Calculate the price per credit based on machine and leasing cost
  if (!machine.usesCredits) return 0;
  
  // If machine has defined credit min/max values, calculate based on leasing min/max
  if (machine.creditMin !== undefined && machine.creditMax !== undefined && 
      machine.leasingMin !== undefined && machine.leasingMax !== undefined) {
    
    // Calculate where in the leasing range this cost falls (as a percentage)
    const leasingRange = machine.leasingMax - machine.leasingMin;
    if (leasingRange <= 0) {
      console.log(`Zero leasing range for ${machine.name}, using credit min: ${machine.creditMin}`);
      return machine.creditMin;
    }
    
    const leasingPosition = (leasingCost - machine.leasingMin) / leasingRange;
    const clampedPosition = Math.max(0, Math.min(1, leasingPosition));
    
    // Interpolate between credit min and max based on that percentage
    const creditRange = machine.creditMax - machine.creditMin;
    const calculatedCredit = Math.round(machine.creditMin + clampedPosition * creditRange);
    
    console.log(`Calculated credit price for ${machine.name} at position ${clampedPosition}:`, {
      leasingCost,
      leasingRange,
      creditRange,
      calculatedCredit
    });
    
    return calculatedCredit;
  }
  
  // Fallback to the multiplier method
  const calculatedCredit = Math.round(leasingCost * machine.creditPriceMultiplier);
  console.log(`Fallback calculated credit price for ${machine.name}: ${calculatedCredit}`);
  return calculatedCredit;
}

export function calculateOperatingCost(
  machine: any,
  treatmentsPerDay: number,
  creditPrice: number
): { costPerMonth: number; useFlatrate: boolean } {
  // Determine if we should use flatrate based on number of treatments
  const useFlatrate = treatmentsPerDay >= FLATRATE_THRESHOLD;
  
  let costPerMonth = 0;
  
  if (machine.usesCredits) {
    if (useFlatrate) {
      // Use flatrate
      costPerMonth = machine.flatrateAmount;
    } else {
      // Calculate based on per-treatment cost with the provided credit price
      const creditsPerTreatment = 1; // Assume 1 credit per treatment for simplicity
      costPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH * creditsPerTreatment * creditPrice;
    }
  }
  
  return { costPerMonth, useFlatrate };
}

export function calculateRevenue(customerPrice: number, treatmentsPerDay: number): {
  revenuePerTreatmentExVat: number;
  dailyRevenueIncVat: number;
  weeklyRevenueIncVat: number;
  monthlyRevenueIncVat: number;
  yearlyRevenueIncVat: number;
  monthlyRevenueExVat: number;
  yearlyRevenueExVat: number;
} {
  const revenuePerTreatmentExVat = customerPrice / (1 + VAT_RATE);
  const dailyRevenueIncVat = customerPrice * treatmentsPerDay;
  const weeklyRevenueIncVat = dailyRevenueIncVat * 5; // Assume 5 working days per week
  const monthlyRevenueIncVat = dailyRevenueIncVat * WORKING_DAYS_PER_MONTH;
  const yearlyRevenueIncVat = monthlyRevenueIncVat * MONTHS_PER_YEAR;
  
  const monthlyRevenueExVat = monthlyRevenueIncVat / (1 + VAT_RATE);
  const yearlyRevenueExVat = yearlyRevenueIncVat / (1 + VAT_RATE);
  
  return {
    revenuePerTreatmentExVat,
    dailyRevenueIncVat,
    weeklyRevenueIncVat,
    monthlyRevenueIncVat,
    yearlyRevenueIncVat,
    monthlyRevenueExVat,
    yearlyRevenueExVat
  };
}

export function calculateOccupancyRevenues(yearlyRevenueIncVat: number): {
  occupancy50: number;
  occupancy75: number;
  occupancy100: number;
} {
  return {
    occupancy50: yearlyRevenueIncVat * 0.5,
    occupancy75: yearlyRevenueIncVat * 0.75,
    occupancy100: yearlyRevenueIncVat
  };
}

export function calculateNetResults(
  monthlyRevenueExVat: number,
  yearlyRevenueExVat: number,
  totalMonthlyCostExVat: number
): {
  netPerMonthExVat: number;
  netPerYearExVat: number;
} {
  const netPerMonthExVat = monthlyRevenueExVat - totalMonthlyCostExVat;
  const netPerYearExVat = yearlyRevenueExVat - (totalMonthlyCostExVat * MONTHS_PER_YEAR);
  
  return {
    netPerMonthExVat,
    netPerYearExVat
  };
}
