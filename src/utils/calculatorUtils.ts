
/**
 * Main calculator utilities - Re-exports from specialized utility files
 */

// Re-export all utility functions to maintain backward compatibility
export { formatCurrency } from './formatUtils';
export { fetchExchangeRate, calculateMachinePriceSEK } from './exchangeRateUtils';
export { calculateLeasingRange, calculateLeasingCost } from './leasingUtils';
export { calculateCreditPrice, calculateOperatingCost } from './creditUtils';
export { 
  calculateRevenue, 
  calculateOccupancyRevenues,
  calculateNetResults 
} from './revenueUtils';

// Re-export constants to maintain backward compatibility
export { 
  VAT_RATE, 
  WORKING_DAYS_PER_MONTH, 
  MONTHS_PER_YEAR, 
  FLATRATE_THRESHOLD 
} from './constants';
