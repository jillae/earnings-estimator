
// Types for the Calculator Context
export interface CalculatorState {
  // Clinic and machine selection
  clinicSize: any;
  selectedMachineId: string;
  
  // Payment option
  paymentOption: 'leasing' | 'cash';
  
  // Leasing options
  selectedLeasingPeriodId: string;
  selectedInsuranceId: string;
  
  // SLA options
  selectedSlaLevel: 'Brons' | 'Silver' | 'Guld';
  
  // Adjustment settings
  leaseAdjustmentFactor: number;
  
  // Treatment settings
  treatmentsPerDay: number;
  customerPrice: number;
  
  // Calculations
  exchangeRate: number;
  machinePriceSEK: number;
  cashPriceSEK: number;
  leasingRange: { min: number, max: number, default: number };
  leasingCost: number;
  creditPrice: number;
  flatrateThreshold: number;
  
  // Operating cost
  operatingCost: { 
    costPerMonth: number, 
    useFlatrate: boolean, 
    slaCost: number,
    totalCost: number 
  };
  
  // Results
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

// Types for the Calculator Context
export interface CalculatorContextType {
  // Clinic and machine selection
  clinicSize: any;
  setClinicSize: (size: any) => void;
  selectedMachineId: string;
  setSelectedMachineId: (id: string) => void;
  selectedMachine: any;
  
  // Payment option
  paymentOption: 'leasing' | 'cash';
  setPaymentOption: (option: 'leasing' | 'cash') => void;
  cashPriceSEK: number;
  
  // Leasing options
  selectedLeasingPeriodId: string;
  setSelectedLeasingPeriodId: (id: string) => void;
  selectedInsuranceId: string;
  setSelectedInsuranceId: (id: string) => void;
  
  // SLA options
  selectedSlaLevel: 'Brons' | 'Silver' | 'Guld';
  setSlaLevel: (level: 'Brons' | 'Silver' | 'Guld') => void;
  
  // Treatment settings
  treatmentsPerDay: number;
  setTreatmentsPerDay: (value: number) => void;
  customerPrice: number;
  setCustomerPrice: (value: number) => void;
  
  // Calculations
  exchangeRate: number;
  machinePriceSEK: number;
  leasingRange: { min: number, max: number, default: number, flatrateThreshold?: number };
  leasingCost: number;
  creditPrice: number;
  
  // Adjustments
  leaseAdjustmentFactor: number;
  setLeaseAdjustmentFactor: (value: number) => void;
  allowBelowFlatrate: boolean;
  setAllowBelowFlatrate: (value: boolean) => void;
  flatrateThreshold: number;
  leasingCostPercentage: number; // Procentandel av max
  
  // Flatrate option - använder string-enum istället för boolean
  useFlatrateOption: 'perCredit' | 'flatrate';
  setUseFlatrateOption: (value: 'perCredit' | 'flatrate') => void;
  
  // Operating costs
  operatingCost: { 
    costPerMonth: number, 
    useFlatrate: boolean, 
    slaCost: number, 
    totalCost: number 
  };
  
  // Results
  revenue: any;
  occupancyRevenues: any;
  netResults: any;
}
