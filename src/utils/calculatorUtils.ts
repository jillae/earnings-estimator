
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
  // Korrigerad beräkning - använder månadsintäkten (ex moms) * 12 för att få årsintäkten
  const yearlyRevenueExVat = monthlyRevenueExVat * 12;
  
  console.log(`Beräknar intäkt:
    Behandlingar per dag: ${treatmentsPerDay}
    Kundpris: ${customerPrice}
    Daglig intäkt (ink moms): ${dailyRevenueIncVat}
    Månadsintäkt (ink moms): ${monthlyRevenueIncVat}
    Årsintäkt (ink moms): ${yearlyRevenueIncVat}
    Månadsintäkt (ex moms): ${monthlyRevenueExVat}
    Årsintäkt (ex moms): ${yearlyRevenueExVat}
  `);
  
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
  yearlyRevenueExVat: number,
  totalMonthlyCostExVat: number
) => {
  // Beräkna netto per månad (ex moms)
  const netPerMonthExVat = monthlyRevenueExVat - totalMonthlyCostExVat;
  
  // Beräkna netto per år (ex moms)
  const netPerYearExVat = yearlyRevenueExVat - (totalMonthlyCostExVat * 12);
  
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

// Exportera de nödvändiga funktionerna från andra moduler
export { calculateLeasingRange } from './leasingRangeUtils';
export { calculateLeasingCost } from './leasingCostUtils';
export { getExchangeRate, fetchExchangeRate, calculateMachinePriceSEK } from './exchangeRateUtils';
