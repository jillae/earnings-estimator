
import { LeasingPeriod, InsuranceOption, InsuranceRates } from './types';
import { LEASING_TARIFFS_2024, LEASING_TARIFFS_2025, LEASING_TARIFFS } from '@/utils/constants';

// 2024 leasingperioder
export const leasingPeriods2024: LeasingPeriod[] = LEASING_TARIFFS_2024;

// 2025 leasingperioder (uppdaterade)
export const leasingPeriods2025: LeasingPeriod[] = LEASING_TARIFFS_2025;

// Standardvärde - använder samma standardvärde som i constants.ts för konsekvens
export const leasingPeriods = LEASING_TARIFFS;

export const insuranceOptions: InsuranceOption[] = [
  { id: "no", name: "Nej", rate: 0 },
  { id: "yes", name: "Ja", rate: 0.025 }
];

export const insuranceRates: InsuranceRates = {
  10000: 0.04,
  20000: 0.03,
  50000: 0.025,
  Infinity: 0.015
};
