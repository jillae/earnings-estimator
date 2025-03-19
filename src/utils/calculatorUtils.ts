import { VAT_RATE, WORKING_DAYS_PER_MONTH, MONTHS_PER_YEAR, FLATRATE_THRESHOLD, Machine } from '../data/machineData';
import { getExchangeRate } from './exchangeRate';

export function formatCurrency(amount: number, shouldRound: boolean = true): string {
  let displayAmount = amount;
  
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
    return 11.49260;
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

export function calculateCreditPrice(machine: any, leasingCost: number): number {
  if (!machine.usesCredits) return 0;
  
  if (machine.creditMin !== undefined && machine.creditMax !== undefined && 
      machine.leasingMin !== undefined && machine.leasingMax !== undefined) {
    
    const leasingRange = machine.leasingMax - machine.leasingMin;
    if (leasingRange <= 0) {
      console.log(`Zero leasing range for ${machine.name}, using credit min: ${machine.creditMin}`);
      return machine.creditMin;
    }
    
    const leasingPosition = Math.max(0, Math.min(1, (leasingCost - machine.leasingMin) / leasingRange));
    
    const inversePosition = 1 - leasingPosition;
    
    const creditRange = machine.creditMax - machine.creditMin;
    
    let calculatedCredit;
    
    if (leasingCost <= machine.leasingMin) {
      calculatedCredit = machine.creditMax;
      console.log(`Using maximum credit price ${machine.creditMax} at minimum leasing cost ${machine.leasingMin}`);
    } 
    else if (leasingCost >= machine.leasingMax) {
      calculatedCredit = machine.creditMin;
      console.log(`Using minimum credit price ${machine.creditMin} at maximum leasing cost ${machine.leasingMax}`);
    } 
    else {
      calculatedCredit = Math.round(machine.creditMin + inversePosition * creditRange);
      console.log(`Interpolated credit price: ${calculatedCredit} at leasing position ${leasingPosition}`);
    }
    
    console.log(`Calculated credit price for ${machine.name}:`, {
      leasingCost,
      leasingMin: machine.leasingMin,
      leasingMax: machine.leasingMax,
      leasingRange,
      leasingPosition,
      inversePosition,
      creditMin: machine.creditMin,
      creditMax: machine.creditMax,
      creditRange,
      calculatedCredit
    });
    
    return calculatedCredit;
  }
  
  const calculatedCredit = Math.round((1 / leasingCost) * machine.creditPriceMultiplier * 1000000);
  console.log(`Fallback calculated credit price for ${machine.name}: ${calculatedCredit}`);
  return calculatedCredit;
}

export function calculateOperatingCost(
  machine: any,
  treatmentsPerDay: number,
  creditPrice: number,
  forceUseFlatrate: boolean = false
): { costPerMonth: number; useFlatrate: boolean } {
  const useFlatrate = forceUseFlatrate && machine.usesCredits && treatmentsPerDay >= FLATRATE_THRESHOLD;
  
  let costPerMonth = 0;
  
  if (machine.usesCredits) {
    if (useFlatrate) {
      costPerMonth = machine.flatrateAmount;
    } else {
      const creditsPerTreatment = 1;
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
  const weeklyRevenueIncVat = dailyRevenueIncVat * 5;
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
