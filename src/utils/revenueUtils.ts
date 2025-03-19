
/**
 * Utility functions for revenue and financial calculations
 */
import { VAT_RATE, WORKING_DAYS_PER_MONTH, MONTHS_PER_YEAR } from './constants';

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
