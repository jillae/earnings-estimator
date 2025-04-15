
// Types for the Calculator Context
export interface CalculatorState {
  // Clinic and machine selection
  clinicSize: any;
  selectedMachineId: string;
  
  // Leasing options
  selectedLeasingPeriodId: string;
  selectedInsuranceId: string;
  
  // Adjustment settings
  leaseAdjustmentFactor: number;
  
  // Treatment settings
  treatmentsPerDay: number;
  customerPrice: number;
  
  // Calculations
  exchangeRate: number;
  machinePriceSEK: number;
  leasingRange: { min: number, max: number, default: number };
  leasingCost: number;
  creditPrice: number;
  flatrateThreshold: number;
  
  // Operating cost
  operatingCost: { costPerMonth: number, useFlatrate: boolean };
  
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
  
  // Leasing options
  selectedLeasingPeriodId: string;
  setSelectedLeasingPeriodId: (id: string) => void;
  selectedInsuranceId: string;
  setSelectedInsuranceId: (id: string) => void;
  
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
  operatingCost: { costPerMonth: number, useFlatrate: boolean };
  
  // Results
  revenue: any;
  occupancyRevenues: any;
  netResults: any;
}
