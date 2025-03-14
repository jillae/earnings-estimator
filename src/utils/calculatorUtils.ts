
import { 
  Machine, 
  VAT_RATE, 
  WORKING_DAYS_PER_MONTH, 
  MONTHS_PER_YEAR, 
  FLATRATE_THRESHOLD,
  DEFAULT_EXCHANGE_RATE,
  SHIPPING_COST_EUR,
  insuranceRates
} from '../data/machineData';

// Fetch exchange rate from Riksbank API
export const fetchExchangeRate = async (fromCurrency = 'EUR', toCurrency = 'SEK'): Promise<number> => {
  try {
    const response = await fetch(
      `https://api.riksbank.se/swea/v1/CrossRates/SEK${fromCurrency.toUpperCase()}PMI/SEK${toCurrency.toUpperCase()}PMI`, 
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch exchange rate');
      return DEFAULT_EXCHANGE_RATE;
    }
    
    const data = await response.json();
    return parseFloat(data.return.groups.group.series.series[0].observations.observation[0].value);
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return DEFAULT_EXCHANGE_RATE;
  }
};

// Calculate machine price in SEK
export const calculateMachinePriceSEK = (machine: Machine, exchangeRate: number): number => {
  const totalPriceEur = machine.priceEur + SHIPPING_COST_EUR;
  return Math.round(totalPriceEur * exchangeRate);
};

// Calculate insurance cost based on machine price
export const calculateInsuranceCost = (machinePriceSEK: number): number => {
  let rate = 0;
  
  for (const [priceThreshold, insuranceRate] of Object.entries(insuranceRates)) {
    if (machinePriceSEK <= parseInt(priceThreshold)) {
      rate = insuranceRate;
      break;
    }
  }
  
  if (rate === 0) {
    rate = insuranceRates.Infinity;
  }
  
  return Math.round(machinePriceSEK * rate / 12); // Convert annual rate to monthly
};

// Calculate leasing cost
export const calculateLeasingCost = (
  machine: Machine,
  machinePriceSEK: number,
  leasingRate: number,
  includeInsurance: boolean,
  leaseAdjustmentFactor: number
): number => {
  const baseLeaseCost = Math.round(machinePriceSEK * leasingRate);
  const insuranceCost = includeInsurance ? calculateInsuranceCost(machinePriceSEK) : 0;
  const adjustedLeaseCost = Math.round(baseLeaseCost * leaseAdjustmentFactor);
  
  return adjustedLeaseCost + insuranceCost;
};

// Calculate min and max leasing costs
export const calculateLeasingRange = (
  machine: Machine,
  machinePriceSEK: number,
  leasingRate: number,
  includeInsurance: boolean
): { min: number, max: number, default: number } => {
  const insuranceCost = includeInsurance ? calculateInsuranceCost(machinePriceSEK) : 0;
  
  const minLease = Math.round(machinePriceSEK * leasingRate * machine.minLeaseMultiplier / machine.defaultLeaseMultiplier) + insuranceCost;
  const maxLease = Math.round(machinePriceSEK * leasingRate * machine.maxLeaseMultiplier / machine.defaultLeaseMultiplier) + insuranceCost;
  const defaultLease = Math.round(machinePriceSEK * leasingRate) + insuranceCost;
  
  return { min: minLease, max: maxLease, default: defaultLease };
};

// Calculate credit price per unit
export const calculateCreditPrice = (machine: Machine, leasingCost: number): number => {
  return Math.round(leasingCost * machine.creditPriceMultiplier);
};

// Calculate operating costs (credits or flatrate)
export const calculateOperatingCost = (
  machine: Machine,
  treatmentsPerDay: number,
  leasingCost: number
): { costPerMonth: number, useFlatrate: boolean } => {
  if (!machine.usesCredits) {
    return { costPerMonth: 0, useFlatrate: false };
  }
  
  const useFlatrate = treatmentsPerDay >= FLATRATE_THRESHOLD;
  
  if (useFlatrate) {
    return { costPerMonth: machine.flatrateAmount, useFlatrate: true };
  } else {
    const creditPrice = calculateCreditPrice(machine, leasingCost);
    const costPerMonth = creditPrice * treatmentsPerDay * WORKING_DAYS_PER_MONTH;
    return { costPerMonth, useFlatrate: false };
  }
};

// Calculate revenue and related metrics based on customer price
export const calculateRevenue = (
  customerPrice: number,
  treatmentsPerDay: number
): {
  revenuePerTreatmentExVat: number,
  dailyRevenueIncVat: number,
  weeklyRevenueIncVat: number,
  monthlyRevenueIncVat: number,
  yearlyRevenueIncVat: number,
  monthlyRevenueExVat: number,
  yearlyRevenueExVat: number
} => {
  const revenuePerTreatmentExVat = customerPrice / (1 + VAT_RATE);
  const dailyRevenueExVat = revenuePerTreatmentExVat * treatmentsPerDay;
  const dailyRevenueIncVat = dailyRevenueExVat * (1 + VAT_RATE);
  
  const weeklyRevenueIncVat = dailyRevenueIncVat * 7;
  const monthlyRevenueIncVat = dailyRevenueIncVat * WORKING_DAYS_PER_MONTH;
  const yearlyRevenueIncVat = monthlyRevenueIncVat * MONTHS_PER_YEAR;
  
  const monthlyRevenueExVat = dailyRevenueExVat * WORKING_DAYS_PER_MONTH;
  const yearlyRevenueExVat = monthlyRevenueExVat * MONTHS_PER_YEAR;
  
  return {
    revenuePerTreatmentExVat,
    dailyRevenueIncVat,
    weeklyRevenueIncVat,
    monthlyRevenueIncVat,
    yearlyRevenueIncVat,
    monthlyRevenueExVat,
    yearlyRevenueExVat
  };
};

// Calculate occupancy based revenues
export const calculateOccupancyRevenues = (
  yearlyRevenueIncVat: number
): {
  occupancy50: number,
  occupancy75: number,
  occupancy100: number
} => {
  return {
    occupancy50: yearlyRevenueIncVat * 0.5,
    occupancy75: yearlyRevenueIncVat * 0.75,
    occupancy100: yearlyRevenueIncVat
  };
};

// Calculate net results
export const calculateNetResults = (
  monthlyRevenueExVat: number,
  yearlyRevenueExVat: number,
  monthlyCostExVat: number
): {
  netPerMonthExVat: number,
  netPerYearExVat: number
} => {
  const netPerMonthExVat = monthlyRevenueExVat - monthlyCostExVat;
  const netPerYearExVat = netPerMonthExVat * MONTHS_PER_YEAR;
  
  return {
    netPerMonthExVat,
    netPerYearExVat
  };
};

// Format currency values for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(Math.round(amount));
};
