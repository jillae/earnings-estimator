
/**
 * Formatterar ett värde till svensk valutaformat
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Beräknar intäkter baserat på antal behandlingar och kundpris
 */
export const calculateRevenue = (
  treatmentsPerDay: number, 
  customerPrice: number
) => {
  const VAT_RATE = 0.25;
  const WORKING_DAYS_PER_MONTH = 22;
  
  // Beräkna daglig intäkt inklusive moms
  const dailyRevenueIncVat = treatmentsPerDay * customerPrice;
  
  // Beräkna veckovis intäkt
  const weeklyRevenueIncVat = dailyRevenueIncVat * 5;
  
  // Beräkna månadsvis intäkt
  const monthlyRevenueIncVat = dailyRevenueIncVat * WORKING_DAYS_PER_MONTH;
  
  // Beräkna årlig intäkt
  const yearlyRevenueIncVat = monthlyRevenueIncVat * 12;
  
  // Beräkna intäkter exklusive moms
  const monthlyRevenueExVat = monthlyRevenueIncVat / (1 + VAT_RATE);
  const yearlyRevenueExVat = monthlyRevenueExVat * 12;
  
  return {
    revenuePerTreatmentExVat: customerPrice / (1 + VAT_RATE),
    dailyRevenueIncVat,
    weeklyRevenueIncVat,
    monthlyRevenueIncVat,
    yearlyRevenueIncVat,
    monthlyRevenueExVat,
    yearlyRevenueExVat
  };
};

/**
 * Beräknar nettoresultat baserat på intäkter och kostnader
 */
export const calculateNetResults = (
  monthlyRevenueExVat: number,
  leasingCost: number = 0,
  operatingCost: number = 0
) => {
  // Beräkna netto per månad (ex moms)
  const netPerMonthExVat = monthlyRevenueExVat - leasingCost - operatingCost;
  
  // Beräkna netto per år (ex moms)
  const netPerYearExVat = netPerMonthExVat * 12;
  
  return {
    netPerMonthExVat,
    netPerYearExVat
  };
};

/**
 * Beräknar intäkter vid olika beläggningsgrader
 */
export const calculateOccupancyRevenues = (
  yearlyRevenueIncVat: number
) => {
  return {
    occupancy50: yearlyRevenueIncVat * 0.5,
    occupancy75: yearlyRevenueIncVat * 0.75,
    occupancy100: yearlyRevenueIncVat
  };
};

// Exportera de saknade funktionerna från leasingUtils.ts
export { calculateLeasingRange } from './leasingRangeUtils';
export { calculateLeasingCost } from './leasingCostUtils';
export { fetchExchangeRate, calculateMachinePriceSEK } from './exchangeRateUtils';
