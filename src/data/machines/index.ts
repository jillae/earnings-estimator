
import { Machine } from './types';
import { premiumMachines } from './premium';
import { treatmentMachines } from './treatment';
import { handheldMachines } from './handheld';
import { specialMachines } from './special';
import { leasingPeriods, insuranceOptions, insuranceRates } from './leasingOptions';
import * as constants from '../../utils/constants';

// Combine all machines into one array
export const machineData: Machine[] = [
  ...premiumMachines,
  ...treatmentMachines,
  ...handheldMachines,
  ...specialMachines
];

// Re-export everything
export { leasingPeriods, insuranceOptions, insuranceRates };
export { 
  VAT_RATE, 
  WORKING_DAYS_PER_MONTH, 
  MONTHS_PER_YEAR, 
  FLATRATE_THRESHOLD,
  SHIPPING_COST_EUR_CREDITS,
  SHIPPING_COST_EUR_NO_CREDITS,
  DEFAULT_EXCHANGE_RATE,
  SMALL_CLINIC_TREATMENTS,
  MEDIUM_CLINIC_TREATMENTS,
  LARGE_CLINIC_TREATMENTS,
  DEFAULT_CUSTOMER_PRICE
} from '../../utils/constants';
export type { Machine, LeasingPeriod, InsuranceOption, InsuranceRates } from './types';

// Export machine categories for filtered views if needed
export { premiumMachines, treatmentMachines, handheldMachines, specialMachines };
