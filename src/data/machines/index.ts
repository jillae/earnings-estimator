
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

// Definiera den önskade ordningen för maskinerna
const machineOrder = [
  "emerald",
  "zerona",
  "fx-635",
  "fx-405",
  "evrl",
  "xlr8",
  "gvl",
  "lunula",
  "base-station"
];

// Kombinera alla maskiner och sortera dem enligt den specificerade ordningen
export const machineData: Machine[] = [
  ...premiumMachines,
  ...treatmentMachines,
  ...handheldMachines,
  ...specialMachines
].sort((a, b) => {
  const indexA = machineOrder.indexOf(a.id);
  const indexB = machineOrder.indexOf(b.id);
  return indexA - indexB;
});

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
