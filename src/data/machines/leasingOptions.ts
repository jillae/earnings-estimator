
import { LeasingPeriod, InsuranceOption, InsuranceRates } from './types';

// 2024 leasingperioder
export const leasingPeriods2024: LeasingPeriod[] = [
  { id: "24", name: "24 månader", rate: 0.04566 },
  { id: "36", name: "36 månader", rate: 0.03189 },
  { id: "48", name: "48 månader", rate: 0.02504 },
  { id: "60", name: "60 månader", rate: 0.02095 }
];

// 2025 leasingperioder (uppdaterade)
export const leasingPeriods2025: LeasingPeriod[] = [
  { id: "24", name: "24 månader", rate: 0.045136 },
  { id: "36", name: "36 månader", rate: 0.031346 },
  { id: "48", name: "48 månader", rate: 0.024475 },
  { id: "60", name: "60 månader", rate: 0.020372 }
];

// Standardvärde - använder 2025 som default
export const leasingPeriods = leasingPeriods2025;

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
