
import { Machine, LeasingPeriod, InsuranceOption } from '@/data/machines/types';
import { ClinicSize, PaymentOption, FlatrateOption, SlaLevel, DriftpaketType } from '@/types/calculator';
import { SliderStep, StepValues } from '@/utils/sliderSteps';

export interface CalculatorContextType {
  // Clinic settings
  clinicSize: ClinicSize;
  setClinicSize: (size: ClinicSize) => void;
  
  // Machine selection
  selectedMachineId: string;
  setSelectedMachineId: (id: string) => void;
  selectedMachine: Machine | undefined;
  
  // Payment options
  paymentOption: PaymentOption;
  setPaymentOption: (option: PaymentOption) => void;
  cashPriceSEK: number;
  
  // Leasing options
  selectedLeasingPeriodId: string;
  setSelectedLeasingPeriodId: (id: string) => void;
  selectedInsuranceId: string;
  setSelectedInsuranceId: (id: string) => void;
  
  // SLA/Driftpaket options
  selectedSlaLevel: SlaLevel;
  setSlaLevel: (level: SlaLevel) => void;
  selectedDriftpaket: DriftpaketType;
  setSelectedDriftpaket: (type: DriftpaketType) => void;
  
  // Treatment settings
  treatmentsPerDay: number;
  setTreatmentsPerDay: (count: number) => void;
  customerPrice: number;
  setCustomerPrice: (price: number) => void;
  
  // Exchange rate and pricing
  exchangeRate: number;
  machinePriceSEK: number;
  
  // Leasing calculation
  leasingRange: {
    min: number;
    max: number;
    default: number;
    flatrateThreshold?: number;
  };
  leasingCost: number;
  
  // 5-step slider
  currentSliderStep: SliderStep;
  setCurrentSliderStep: (step: SliderStep) => void;
  stepValues: Record<SliderStep, StepValues>;
  currentStepValues: StepValues;
  
  // Credit and flatrate
  creditPrice: number;
  calculatedCreditPrice: number;
  calculatedSlaCostSilver: number;
  calculatedSlaCostGuld: number;
  allowBelowFlatrate: boolean;
  setAllowBelowFlatrate: (allow: boolean) => void;
  flatrateThreshold: number;
  useFlatrateOption: FlatrateOption;
  setUseFlatrateOption: (option: FlatrateOption) => void;
  
  // Operating costs
  operatingCost: {
    costPerMonth: number;
    useFlatrate: boolean;
    slaCost: number;
    totalCost: number;
  };
  
  // Revenue and net results
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
  
  // Reference values
  slaCosts: {
    Brons: number;
    Silver: number;
    Guld: number;
  };
  leasingMax60mRef: number;
}
