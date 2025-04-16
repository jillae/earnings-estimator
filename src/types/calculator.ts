
import { Machine } from '@/data/machines/types';

export type ClinicSize = 'small' | 'medium' | 'large';
export type PaymentOption = 'leasing' | 'cash';
export type FlatrateOption = 'flatrate' | 'perCredit';
export type SlaLevel = 'Brons' | 'Silver' | 'Guld';

export interface OperatingCost {
  costPerMonth: number;
  useFlatrate: boolean;
  slaCost: number;
  totalCost: number;
}

export interface Revenue {
  revenuePerTreatmentExVat: number;
  dailyRevenueIncVat: number;
  weeklyRevenueIncVat: number;
  monthlyRevenueIncVat: number;
  yearlyRevenueIncVat: number;
  monthlyRevenueExVat: number;
  yearlyRevenueExVat: number;
}

export interface OccupancyRevenues {
  occupancy50: number;
  occupancy75: number;
  occupancy100: number;
}

export interface NetResults {
  netPerMonthExVat: number;
  netPerYearExVat: number;
}

export interface CalculatorState {
  clinicSize: ClinicSize;
  selectedMachineId: string;
  paymentOption: PaymentOption;
  selectedLeasingPeriodId: string;
  selectedInsuranceId: string;
  selectedSlaLevel: SlaLevel;
  leaseAdjustmentFactor: number;
  treatmentsPerDay: number;
  customerPrice: number;
  exchangeRate: number;
  machinePriceSEK: number;
  cashPriceSEK: number;
  leasingRange: {
    min: number;
    max: number;
    default: number;
    flatrateThreshold?: number;
  };
  leasingCost: number;
  creditPrice: number;
  flatrateThreshold: number;
  operatingCost: OperatingCost;
  revenue: Revenue;
  occupancyRevenues: OccupancyRevenues;
  netResults: NetResults;
}

