
import { VAT_RATE, WORKING_DAYS_PER_MONTH, MONTHS_PER_YEAR, FLATRATE_THRESHOLD } from '../data/machineData';
import { getExchangeRate } from './exchangeRate';

export async function fetchExchangeRate(): Promise<number> {
  try {
    const rate = await getExchangeRate('EUR', 'SEK');
    return rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 11.49260; // Default EUR to SEK rate if API fails
  }
}

export function calculateMachinePriceSEK(machine: any, exchangeRate: number): number {
  return machine.priceEur * exchangeRate;
}

export function calculateLeasingRange(
  machine: any,
  machinePriceSEK: number,
  leasingRate: number,
  includeInsurance: boolean
): { min: number; max: number; default: number } {
  const minMultiplier = machine.minLeaseMultiplier;
  const maxMultiplier = machine.maxLeaseMultiplier;
  const defaultMultiplier = machine.defaultLeaseMultiplier;
  
  // Base leasing amount calculations
  const baseLeasingMin = machinePriceSEK * leasingRate * minMultiplier;
  const baseLeasingMax = machinePriceSEK * leasingRate * maxMultiplier;
  const baseLeasingDefault = machinePriceSEK * leasingRate * defaultMultiplier;

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
  }
  
  return {
    min: baseLeasingMin + insuranceCost,
    max: baseLeasingMax + insuranceCost,
    default: baseLeasingDefault + insuranceCost
  };
}

export function calculateLeasingCost(
  machine: any,
  machinePriceSEK: number,
  leasingRate: number,
  includeInsurance: boolean,
  leaseMultiplier: number
): number {
  // Base leasing calculation
  const baseLeasingCost = machinePriceSEK * leasingRate * leaseMultiplier;
  
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
  }
  
  return baseLeasingCost + insuranceCost;
}

export function calculateCreditPrice(machine: any, leasingCost: number): number {
  // Calculate the price per credit based on machine and leasing cost
  return leasingCost * machine.creditPriceMultiplier;
}

export function calculateOperatingCost(
  machine: any,
  treatmentsPerDay: number,
  leasingCost: number
): { costPerMonth: number; useFlatrate: boolean } {
  // Determine if we should use flatrate based on number of treatments
  const useFlatrate = treatmentsPerDay >= FLATRATE_THRESHOLD;
  
  let costPerMonth = 0;
  
  if (machine.usesCredits) {
    if (useFlatrate) {
      // Use flatrate
      costPerMonth = machine.flatrateAmount;
    } else {
      // Calculate based on per-treatment cost
      const creditsPerTreatment = 1; // Assume 1 credit per treatment for simplicity
      const creditPrice = calculateCreditPrice(machine, leasingCost);
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
