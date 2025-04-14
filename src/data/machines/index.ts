
import { Machine } from './types';
import { handheldMachines } from './handheld';
import { premiumMachines } from './premium';
import { specialMachines } from './special';
import { treatmentMachines } from './treatment';
import { leasingPeriods, insuranceOptions, insuranceRates } from './leasingOptions';
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
} from '../utils/constants';

const thumbsMachines: Machine[] = [
  {
    id: 'thumbs-up',
    name: 'Tumme Upp',
    modelCode: 'THUMB-UP',
    description: 'Positiv maskin för optimistiska resultat',
    usesCredits: false,
    priceEur: 0,
    flatrateAmount: 0,
    defaultCustomerPrice: 2500,
    defaultLeasingPeriod: '60',
    minLeaseMultiplier: 0.8,
    maxLeaseMultiplier: 1,
    defaultLeaseMultiplier: 1,
    creditPriceMultiplier: 1
  },
  {
    id: 'thumbs-down',
    name: 'Tumme Ner',
    modelCode: 'THUMB-DOWN',
    description: 'Pessimistisk maskin för konservativa beräkningar',
    usesCredits: false,
    priceEur: 0,
    flatrateAmount: 0,
    defaultCustomerPrice: 2000,
    defaultLeasingPeriod: '60',
    minLeaseMultiplier: 0.8,
    maxLeaseMultiplier: 1,
    defaultLeaseMultiplier: 1,
    creditPriceMultiplier: 1
  }
];

export const machineData: Machine[] = [
  ...handheldMachines,
  ...premiumMachines,
  ...specialMachines,
  ...treatmentMachines,
  ...thumbsMachines
];

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
