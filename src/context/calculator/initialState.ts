
import { machineData } from '@/data/machines';
import { CalculatorState } from './types';

// Initial state values for the calculator
export const initialState: CalculatorState = {
  clinicSize: 'medium',
  selectedMachineId: "select-machine", // Default to "select-machine"
  paymentOption: "leasing", // Default till leasing
  selectedLeasingPeriodId: "48", // Default to 48 months
  selectedInsuranceId: "yes", // Default to include insurance
  selectedSlaLevel: "Brons", // Default till Brons (ingår)
  leaseAdjustmentFactor: 0.5, // Sätt default till 50%
  treatmentsPerDay: 4, // Default to medium clinic
  customerPrice: machineData[0]?.defaultCustomerPrice || 1990,
  exchangeRate: 11.49260,
  machinePriceSEK: 0,
  cashPriceSEK: 0,
  leasingRange: { min: 0, max: 0, default: 0 },
  leasingCost: 0,
  creditPrice: 0,
  flatrateThreshold: 0,
  operatingCost: { 
    costPerMonth: 0, 
    useFlatrate: false,
    slaCost: 0,
    totalCost: 0 
  },
  revenue: {
    revenuePerTreatmentExVat: 0,
    dailyRevenueIncVat: 0,
    weeklyRevenueIncVat: 0,
    monthlyRevenueIncVat: 0,
    yearlyRevenueIncVat: 0,
    monthlyRevenueExVat: 0,
    yearlyRevenueExVat: 0
  },
  occupancyRevenues: {
    occupancy50: 0,
    occupancy75: 0,
    occupancy100: 0
  },
  netResults: {
    netPerMonthExVat: 0,
    netPerYearExVat: 0
  }
};
