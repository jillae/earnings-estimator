
/**
 * @deprecated Use RevenueEngine and formatCurrency from formatUtils instead
 * Detta är en wrapper för bakåtkompatibilitet
 */

import { RevenueEngine } from './core/RevenueEngine';
import { formatCurrency } from './formatUtils';

// Re-export formatCurrency
export { formatCurrency };

// Wrapper functions for backward compatibility
export const calculateRevenue = (treatmentsPerDay: number, customerPrice: number) => {
  const result = RevenueEngine.calculateRevenue(treatmentsPerDay, customerPrice);
  
  // Mappar till gamla strukturen för bakåtkompatibilitet
  return {
    revenuePerTreatmentExVat: result.dailyRevenueExVat / treatmentsPerDay,
    dailyRevenueIncVat: result.dailyRevenueIncVat,
    weeklyRevenueIncVat: result.weeklyRevenueIncVat,
    monthlyRevenueIncVat: result.monthlyRevenueIncVat,
    yearlyRevenueIncVat: result.yearlyRevenueIncVat,
    monthlyRevenueExVat: result.monthlyRevenueExVat,
    yearlyRevenueExVat: result.yearlyRevenueExVat
  };
};

export const calculateNetResults = (
  monthlyRevenueExVat: number,
  yearlyRevenueExVat: number,
  totalMonthlyCostExVat: number
) => {
  return RevenueEngine.calculateNetResults(monthlyRevenueExVat, yearlyRevenueExVat, totalMonthlyCostExVat);
};

export const calculateOccupancyRevenues = (yearlyRevenueIncVat: number) => {
  return RevenueEngine.calculateOccupancyRevenues(yearlyRevenueIncVat);
};

// Exportera de nödvändiga funktionerna från andra moduler
export { calculateLeasingRange } from './leasingRangeUtils';
export { calculateLeasingCost } from './leasingCostUtils';
export { getExchangeRate, fetchExchangeRate, calculateMachinePriceSEK } from './exchangeRateUtils';
