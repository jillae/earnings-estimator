
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
  // Calculate revenue with VAT included
  const revenuePerTreatmentExVat = customerPrice / (1 + VAT_RATE);
  const dailyRevenueIncVat = customerPrice * treatmentsPerDay;
  const weeklyRevenueIncVat = dailyRevenueIncVat * 5; // 5 working days per week
  const monthlyRevenueIncVat = dailyRevenueIncVat * WORKING_DAYS_PER_MONTH;
  const yearlyRevenueIncVat = monthlyRevenueIncVat * MONTHS_PER_YEAR;
  
  // Calculate revenue excluding VAT
  const monthlyRevenueExVat = monthlyRevenueIncVat / (1 + VAT_RATE);
  const yearlyRevenueExVat = yearlyRevenueIncVat / (1 + VAT_RATE);
  
  console.log(`Revenue calculation:
    Customer price: ${customerPrice}
    Treatments per day: ${treatmentsPerDay}
    Daily revenue (inc VAT): ${dailyRevenueIncVat}
    Monthly revenue (inc VAT): ${monthlyRevenueIncVat}
    Monthly revenue (ex VAT): ${monthlyRevenueExVat}
    Net calculation per month example: ${monthlyRevenueExVat} - 4500 = ${monthlyRevenueExVat - 4500}
  `);
  
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
  
  console.log(`Net result calculation:
    Monthly revenue (ex VAT): ${monthlyRevenueExVat}
    Total monthly cost (ex VAT): ${totalMonthlyCostExVat}
    Net per month (ex VAT): ${netPerMonthExVat}
    Net per year (ex VAT): ${netPerYearExVat}
  `);
  
  return {
    netPerMonthExVat,
    netPerYearExVat
  };
}
