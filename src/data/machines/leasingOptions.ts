
import { LeasingPeriod, InsuranceOption, InsuranceRates } from './types';

export const leasingPeriods: LeasingPeriod[] = [
  { id: "24", name: "24 månader", rate: 0.04566 },
  { id: "36", name: "36 månader", rate: 0.03189 },
  { id: "48", name: "48 månader", rate: 0.02504 },
  { id: "60", name: "60 månader", rate: 0.02095 }
];

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
