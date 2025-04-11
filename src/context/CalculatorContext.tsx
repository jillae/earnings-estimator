
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  calculateRevenue, 
  calculateNetResults, 
  calculateOccupancyRevenues 
} from '@/utils/calculatorUtils';
import { 
  SMALL_CLINIC_TREATMENTS,
  MEDIUM_CLINIC_TREATMENTS,
  LARGE_CLINIC_TREATMENTS
} from '@/utils/constants';
import { CalculatorContextType } from '@/context/calculator/types';

// Skapa context
const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

// Custom hook för att använda calculator-context
export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator måste användas inom en CalculatorProvider');
  }
  return context;
};

// Context provider
export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Grundläggande tillstånd
  const [clinicSize, setClinicSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [treatmentsPerDay, setTreatmentsPerDay] = useState(MEDIUM_CLINIC_TREATMENTS);
  const [customerPrice, setCustomerPrice] = useState(1800);
  const [selectedMachineId, setSelectedMachineId] = useState('select-machine');
  
  // Beräknade värden
  const [revenue, setRevenue] = useState({
    revenuePerTreatmentExVat: 0,
    dailyRevenueIncVat: 0,
    weeklyRevenueIncVat: 0,
    monthlyRevenueIncVat: 0,
    yearlyRevenueIncVat: 0,
    monthlyRevenueExVat: 0,
    yearlyRevenueExVat: 0
  });
  
  const [netResults, setNetResults] = useState({
    netPerMonthExVat: 0,
    netPerYearExVat: 0
  });
  
  const [occupancyRevenues, setOccupancyRevenues] = useState({
    occupancy50: 0,
    occupancy75: 0,
    occupancy100: 0
  });
  
  // Uppdatera antal behandlingar baserat på klinikstorlek
  useEffect(() => {
    if (clinicSize === 'small') {
      setTreatmentsPerDay(SMALL_CLINIC_TREATMENTS);
    } else if (clinicSize === 'medium') {
      setTreatmentsPerDay(MEDIUM_CLINIC_TREATMENTS);
    } else {
      setTreatmentsPerDay(LARGE_CLINIC_TREATMENTS);
    }
  }, [clinicSize]);
  
  // Beräkna intäkter när relevant data ändras
  useEffect(() => {
    const calculatedRevenue = calculateRevenue(treatmentsPerDay, customerPrice);
    setRevenue(calculatedRevenue);
    
    // I denna förenklade version har vi inga leasingkostnader eller driftkostnader ännu
    const leasingCost = 0;
    const operatingCostPerMonth = 0;
    
    const calculatedNetResults = calculateNetResults(
      calculatedRevenue.monthlyRevenueExVat,
      calculatedRevenue.yearlyRevenueExVat,
      leasingCost + operatingCostPerMonth
    );
    setNetResults(calculatedNetResults);
    
    const calculatedOccupancyRevenues = calculateOccupancyRevenues(
      calculatedRevenue.yearlyRevenueIncVat
    );
    setOccupancyRevenues(calculatedOccupancyRevenues);
  }, [treatmentsPerDay, customerPrice]);
  
  // Skapa ett dummyobjekt för att uppfylla typen CalculatorContextType
  // Detta är bara för att undvika typfel under utveckling
  const dummyValues = {
    selectedMachine: null,
    selectedLeasingPeriodId: '',
    setSelectedLeasingPeriodId: () => {},
    selectedInsuranceId: '',
    setSelectedInsuranceId: () => {},
    exchangeRate: 0,
    machinePriceSEK: 0,
    leasingRange: { min: 0, max: 0, default: 0 },
    leasingCost: 0,
    leasingCostPercentage: 0,
    creditPrice: 0,
    leaseAdjustmentFactor: 0,
    setLeaseAdjustmentFactor: () => {},
    allowBelowFlatrate: false,
    setAllowBelowFlatrate: () => {},
    flatrateThreshold: 0,
    useFlatrateOption: 'perCredit' as const,
    setUseFlatrateOption: () => {},
    operatingCost: { costPerMonth: 0, useFlatrate: false }
  };
  
  // Värden att göra tillgängliga via context
  const value: CalculatorContextType = {
    clinicSize,
    setClinicSize,
    treatmentsPerDay,
    setTreatmentsPerDay,
    customerPrice,
    setCustomerPrice,
    selectedMachineId,
    setSelectedMachineId,
    leasingCost: 0, // Ingen leasingkostnad i första iterationen
    operatingCost: { costPerMonth: 0, useFlatrate: false }, // Ingen driftkostnad i första iterationen
    revenue,
    netResults,
    occupancyRevenues,
    ...dummyValues // Lägg till dummyvärden för att uppfylla typen
  };
  
  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};
