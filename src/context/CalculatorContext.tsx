
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

// Definiera context-typen
type CalculatorContextType = {
  clinicSize: 'small' | 'medium' | 'large';
  setClinicSize: (size: 'small' | 'medium' | 'large') => void;
  treatmentsPerDay: number;
  setTreatmentsPerDay: (value: number) => void;
  customerPrice: number;
  setCustomerPrice: (value: number) => void;
  leasingCost: number;
  operatingCost: number;
  revenue: any;
  netResults: any;
  occupancyRevenues: any;
};

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
    const operatingCost = 0;
    
    const calculatedNetResults = calculateNetResults(
      calculatedRevenue.monthlyRevenueExVat,
      leasingCost,
      operatingCost
    );
    setNetResults(calculatedNetResults);
    
    const calculatedOccupancyRevenues = calculateOccupancyRevenues(
      calculatedRevenue.yearlyRevenueIncVat
    );
    setOccupancyRevenues(calculatedOccupancyRevenues);
  }, [treatmentsPerDay, customerPrice]);
  
  // Värden att göra tillgängliga via context
  const value = {
    clinicSize,
    setClinicSize,
    treatmentsPerDay,
    setTreatmentsPerDay,
    customerPrice,
    setCustomerPrice,
    leasingCost: 0, // Ingen leasingkostnad i första iterationen
    operatingCost: 0, // Ingen driftkostnad i första iterationen
    revenue,
    netResults,
    occupancyRevenues
  };
  
  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};
