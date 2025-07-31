
import { Machine, LeasingPeriod, InsuranceOption } from '@/data/machines/types';
import { ClinicSize, PaymentOption, FlatrateOption, SlaLevel, DriftpaketType, OperatingCost, Revenue, OccupancyRevenues, NetResults } from '@/types/calculator';
import { SliderStep, StepValues } from '@/utils/sliderSteps';
import { InfoText } from '@/data/infoTexts';

export interface CalculatorState {
  clinicSize: ClinicSize;
  selectedMachineId: string;
  paymentOption: PaymentOption;
  selectedLeasingPeriodId: string;
  selectedInsuranceId: string;
  selectedSlaLevel: SlaLevel;
  selectedDriftpaket: DriftpaketType;
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
  calculatedCreditPrice: number;
  calculatedSlaCostSilver: number;
  calculatedSlaCostGuld: number;
  flatrateThreshold: number;
  operatingCost: OperatingCost;
  revenue: Revenue;
  occupancyRevenues: OccupancyRevenues;
  netResults: NetResults;
  workDaysPerMonth: number;
}

export interface CalculatorContextType {
  clinicSize: ClinicSize;
  setClinicSize: (size: ClinicSize) => void;
  
  selectedMachineId: string;
  setSelectedMachineId: (id: string) => void;
  selectedMachine: Machine | undefined;
  
  paymentOption: PaymentOption;
  setPaymentOption: (option: PaymentOption) => void;
  cashPriceSEK: number;
  
  selectedLeasingPeriodId: string;
  setSelectedLeasingPeriodId: (id: string) => void;
  selectedInsuranceId: string;
  setSelectedInsuranceId: (id: string) => void;
  
  selectedSlaLevel: SlaLevel;
  setSlaLevel: (level: SlaLevel) => void;
  selectedDriftpaket: DriftpaketType;
  setSelectedDriftpaket: (type: DriftpaketType) => void;
  
  treatmentsPerDay: number;
  setTreatmentsPerDay: (count: number) => void;
  customerPrice: number;
  setCustomerPrice: (price: number) => void;
  
  exchangeRate: number;
  machinePriceSEK: number;
  
  leasingRange: {
    min: number;
    max: number;
    default: number;
    flatrateThreshold?: number;
  };
  leasingCost: number;
  
  currentSliderStep: SliderStep;
  setCurrentSliderStep: (step: SliderStep) => void;
  stepValues: Record<SliderStep, StepValues>;
  currentStepValues: StepValues;
  
  creditPrice: number;
  calculatedCreditPrice: number;
  calculatedSlaCostSilver: number;
  calculatedSlaCostGuld: number;
  allowBelowFlatrate: boolean;
  setAllowBelowFlatrate: (allow: boolean) => void;
  flatrateThreshold: number;
  useFlatrateOption: FlatrateOption;
  setUseFlatrateOption: (option: FlatrateOption) => void;
  
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
  
  currentInfoText: InfoText | null;
  setCurrentInfoText: (infoText: InfoText | null) => void;
  
  slaCosts: {
    Brons: number;
    Silver: number;
    Guld: number;
  };
  leasingMax60mRef: number;
  
  // Nya egenskaper
  isFlatrateViable: boolean;
  isLeasingFlatrateViable: boolean;
  
  // Leasingmodell-val
  selectedLeasingModel: 'hybridmodell' | 'strategimodell';
  setSelectedLeasingModel: (model: 'hybridmodell' | 'strategimodell') => void;
  
  // Gated access funktionalitet
  isUnlocked: boolean;
  triggerOptIn: () => boolean;
  logInteraction: (action: string, data: any) => void;
  logSignificantInteraction: (action: string) => void;
  interactionCount: number;
  
  workDaysPerMonth: number;
  setWorkDaysPerMonth: (days: number) => void;
}

export type HoveredInput = 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null;
