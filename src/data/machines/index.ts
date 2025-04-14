
import { Machine } from './types';
import { handheldMachines } from './handheld';
import { premiumMachines } from './premium';
import { specialMachines } from './special';
import { treatmentMachines } from './treatment';
import {
  leasingPeriods,
  insuranceOptions,
  insuranceRates
} from './leasingOptions';
import {
  VAT_RATE,
  WORKING_DAYS_PER_MONTH,
  MONTHS_PER_YEAR,
  SMALL_CLINIC_TREATMENTS,
  MEDIUM_CLINIC_TREATMENTS,
  LARGE_CLINIC_TREATMENTS,
  FLATRATE_THRESHOLD,
  SHIPPING_COST_EUR_CREDITS,
  SHIPPING_COST_EUR_NO_CREDITS,
  DEFAULT_EXCHANGE_RATE,
  DEFAULT_CUSTOMER_PRICE
} from '../../utils/constants';

// Kombinera alla maskiner och sortera dem alfabetiskt på namn
export const machineData: Machine[] = [
  ...handheldMachines,
  ...premiumMachines,
  ...specialMachines,
  ...treatmentMachines
].sort((a, b) => a.name.localeCompare(b.name, 'sv'));

// Reexport all constants
export {
  leasingPeriods,
  insuranceOptions,
  insuranceRates,
  VAT_RATE,
  WORKING_DAYS_PER_MONTH,
  MONTHS_PER_YEAR,
  SMALL_CLINIC_TREATMENTS,
  MEDIUM_CLINIC_TREATMENTS,
  LARGE_CLINIC_TREATMENTS,
  FLATRATE_THRESHOLD,
  SHIPPING_COST_EUR_CREDITS,
  SHIPPING_COST_EUR_NO_CREDITS,
  DEFAULT_EXCHANGE_RATE,
  DEFAULT_CUSTOMER_PRICE
};
