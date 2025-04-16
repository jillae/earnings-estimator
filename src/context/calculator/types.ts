
import { FlatrateOption, PaymentOption, SlaLevel } from "@/utils/constants";
import { Machine } from "@/data/machines/types";

export interface CalculatorContextType {
  // State selections and data
  clinicSize: 'small' | 'medium' | 'large';
  selectedMachineId: string;
  selectedMachine: Machine | null;
  paymentOption: PaymentOption;
  selectedLeasingPeriodId: string;
  selectedInsuranceId: string;
  selectedSlaLevel: SlaLevel;
  treatmentsPerDay: number;
  customerPrice: number;
  
  // Setters
  setClinicSize: (size: 'small' | 'medium' | 'large') => void;
  setSelectedMachineId: (id: string) => void;
  setPaymentOption: (option: PaymentOption) => void;
  setSelectedLeasingPeriodId: (id: string) => void;
  setSelectedInsuranceId: (id: string) => void;
  setSlaLevel: (level: SlaLevel) => void;
  setTreatmentsPerDay: (treatments: number) => void;
  setCustomerPrice: (price: number) => void;
  
  // Machine pricing
  exchangeRate: number;
  machinePriceSEK: number;
  cashPriceSEK: number;
  
  // Leasing calculations
  leasingRange: {
    min: number;
    max: number;
    default: number;
    flatrateThreshold?: number;
  };
  leasingCost: number;
  leasingCostPercentage: number;
  creditPrice: number;
  calculatedCreditPrice: number; // Ny egenskap som behövs i LeaseAdjuster
  leaseAdjustmentFactor: number;
  setLeaseAdjustmentFactor: (factor: number) => void;
  allowBelowFlatrate: boolean;
  setAllowBelowFlatrate: (allow: boolean) => void;
  flatrateThreshold: number;
  
  // Flatrate options
  useFlatrateOption: FlatrateOption;
  setUseFlatrateOption: (option: FlatrateOption) => void;
  
  // Operating costs & SLA
  operatingCost: {
    costPerMonth: number;
    useFlatrate: boolean;
    slaCost: number;
    totalCost: number;
  };
  slaCosts: {
    Brons: number;
    Silver: number;
    Guld: number;
  };
  leasingMax60mRef: number;
  
  // Revenue & results
  revenue: {
    revenuePerTreatmentExVat: number;
    dailyRevenueIncVat: number;
    weeklyRevenueIncVat: number;
    monthlyRevenueIncVat: number;
    yearlyRevenueIncVat: number;
    monthlyRevenueExVat: number;
    yearlyRevenueExVat: number;
  };
  occupancyRevenues: {
    occupancy50: number;
    occupancy75: number;
    occupancy100: number;
  };
  netResults: {
    netPerMonthExVat: number;
    netPerYearExVat: number;
  };
}

// Definiera en separat typ för state (utan metoder)
export interface CalculatorState {
  clinicSize: 'small' | 'medium' | 'large';
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
  calculatedCreditPrice: number; // Lägg till även här
  flatrateThreshold: number;
  operatingCost: {
    costPerMonth: number;
    useFlatrate: boolean;
    slaCost: number;
    totalCost: number;
  };
  revenue: {
    revenuePerTreatmentExVat: number;
    dailyRevenueIncVat: number;
    weeklyRevenueIncVat: number;
    monthlyRevenueIncVat: number;
    yearlyRevenueIncVat: number;
    monthlyRevenueExVat: number;
    yearlyRevenueExVat: number;
  };
  occupancyRevenues: {
    occupancy50: number;
    occupancy75: number;
    occupancy100: number;
  };
  netResults: {
    netPerMonthExVat: number;
    netPerYearExVat: number;
  };
}
