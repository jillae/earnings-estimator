
import React, { createContext, useContext, useState, useEffect } from 'react';
import { machineData, leasingPeriods, insuranceOptions, SMALL_CLINIC_TREATMENTS, MEDIUM_CLINIC_TREATMENTS, LARGE_CLINIC_TREATMENTS, DEFAULT_CUSTOMER_PRICE } from '../data/machines';
import {
  fetchExchangeRate,
  calculateMachinePriceSEK,
  calculateLeasingCost,
  calculateLeasingRange,
  calculateCreditPrice,
  calculateOperatingCost,
  calculateRevenue,
  calculateOccupancyRevenues,
  calculateNetResults,
  shouldUseFlatrate
} from '../utils/calculatorUtils';

interface CalculatorContextType {
  // Clinic and machine selection
  clinicSize: number;
  setClinicSize: (size: number) => void;
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
  leasingRange: { min: number, max: number, default: number };
  leasingCost: number;
  creditPrice: number;
  handleCreditPriceChange: (value: number) => void;
  
  // Adjustments
  leaseAdjustmentFactor: number;
  setLeaseAdjustmentFactor: (value: number) => void;
  flatrateThreshold: number;
  
  // Operating costs
  operatingCost: { costPerMonth: number, useFlatrate: boolean };
  
  // Results
  revenue: any;
  occupancyRevenues: any;
  netResults: any;
}

export const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clinicSize, setClinicSize] = useState<number>(2);
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machineData[0].id);
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>(leasingPeriods[2].id);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>(insuranceOptions[1].id);
  const [leaseAdjustmentFactor, setLeaseAdjustmentFactor] = useState<number>(1);
  const [treatmentsPerDay, setTreatmentsPerDay] = useState<number>(MEDIUM_CLINIC_TREATMENTS);
  const [customerPrice, setCustomerPrice] = useState<number>(machineData[0].defaultCustomerPrice || DEFAULT_CUSTOMER_PRICE);
  const [exchangeRate, setExchangeRate] = useState<number>(11.49260);
  const [machinePriceSEK, setMachinePriceSEK] = useState<number>(0);
  const [leasingRange, setLeasingRange] = useState<{ min: number, max: number, default: number }>({ min: 0, max: 0, default: 0 });
  const [leasingCost, setLeasingCost] = useState<number>(0);
  const [creditPrice, setCreditPrice] = useState<number>(0);
  const [isUpdatingFromCreditPrice, setIsUpdatingFromCreditPrice] = useState<boolean>(false);
  const [isUpdatingFromLeasingCost, setIsUpdatingFromLeasingCost] = useState<boolean>(false);
  const [operatingCost, setOperatingCost] = useState<{ costPerMonth: number, useFlatrate: boolean }>({ costPerMonth: 0, useFlatrate: false });
  const [revenue, setRevenue] = useState<any>({
    revenuePerTreatmentExVat: 0,
    dailyRevenueIncVat: 0,
    weeklyRevenueIncVat: 0,
    monthlyRevenueIncVat: 0,
    yearlyRevenueIncVat: 0,
    monthlyRevenueExVat: 0,
    yearlyRevenueExVat: 0
  });
  const [occupancyRevenues, setOccupancyRevenues] = useState<any>({
    occupancy50: 0,
    occupancy75: 0,
    occupancy100: 0
  });
  const [netResults, setNetResults] = useState<any>({
    netPerMonthExVat: 0,
    netPerYearExVat: 0
  });
  const [flatrateThreshold, setFlatrateThreshold] = useState<number>(0);

  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        const rate = await fetchExchangeRate();
        console.log("Fetched exchange rate:", rate);
        setExchangeRate(rate);
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      }
    };
    
    getExchangeRate();
  }, []);

  useEffect(() => {
    switch (clinicSize) {
      case 1:
        setTreatmentsPerDay(SMALL_CLINIC_TREATMENTS);
        break;
      case 2:
        setTreatmentsPerDay(MEDIUM_CLINIC_TREATMENTS);
        break;
      case 3:
        setTreatmentsPerDay(LARGE_CLINIC_TREATMENTS);
        break;
    }
  }, [clinicSize]);

  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    if (selectedMachine) {
      setCustomerPrice(selectedMachine.defaultCustomerPrice || DEFAULT_CUSTOMER_PRICE);
      
      if (selectedMachine.defaultLeasingPeriod) {
        setSelectedLeasingPeriodId(selectedMachine.defaultLeasingPeriod);
      }
      
      const priceSEK = calculateMachinePriceSEK(selectedMachine, exchangeRate);
      console.log("Machine price in SEK:", priceSEK);
      setMachinePriceSEK(priceSEK);
    }
  }, [selectedMachineId, exchangeRate]);

  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    const selectedLeasingPeriod = leasingPeriods.find(period => period.id === selectedLeasingPeriodId);
    const includeInsurance = selectedInsuranceId === 'yes';
    
    if (selectedMachine && selectedLeasingPeriod) {
      const range = calculateLeasingRange(
        selectedMachine,
        machinePriceSEK,
        selectedLeasingPeriod.rate,
        includeInsurance
      );
      
      console.log("Leasing range calculated:", range);
      setLeasingRange(range);
      
      selectedMachine.leasingMax = range.max;
      selectedMachine.leasingMin = range.min;
      console.log(`Updated ${selectedMachine.name} with dynamic leasing range: min=${range.min}, max=${range.max}`);
      
      if (!selectedMachine.usesCredits) {
        setLeaseAdjustmentFactor(1);
      } else {
        setLeaseAdjustmentFactor(1);
      }
      
      if (selectedMachine.usesCredits) {
        const threshold = range.max * 0.8;
        console.log("Flatrate threshold calculated:", threshold);
        setFlatrateThreshold(threshold);
      }
    }
  }, [selectedMachineId, machinePriceSEK, selectedLeasingPeriodId, selectedInsuranceId]);

  useEffect(() => {
    if (isUpdatingFromCreditPrice) {
      console.log("Skipping leasing cost calculation because update is from credit price change");
      return;
    }
    
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    const selectedLeasingPeriod = leasingPeriods.find(period => period.id === selectedLeasingPeriodId);
    const includeInsurance = selectedInsuranceId === 'yes';
    
    if (selectedMachine && selectedLeasingPeriod) {
      console.log(`Calculating leasing cost with adjustment factor: ${leaseAdjustmentFactor}`);
      
      const calculatedLeasingCost = calculateLeasingCost(
        selectedMachine,
        machinePriceSEK,
        selectedLeasingPeriod.rate,
        includeInsurance,
        leaseAdjustmentFactor
      );
      
      let finalLeasingCost = calculatedLeasingCost;
      
      if (!includeInsurance && finalLeasingCost > leasingRange.max) {
        finalLeasingCost = leasingRange.max;
      } else if (includeInsurance) {
        let insuranceRate = 0.015;
        if (machinePriceSEK <= 10000) {
          insuranceRate = 0.04;
        } else if (machinePriceSEK <= 20000) {
          insuranceRate = 0.03;
        } else if (machinePriceSEK <= 50000) {
          insuranceRate = 0.025;
        }
        const insuranceCost = machinePriceSEK * insuranceRate / 12;
        
        const costWithoutInsurance = finalLeasingCost - insuranceCost;
        if (costWithoutInsurance > leasingRange.max) {
          finalLeasingCost = leasingRange.max + insuranceCost;
        }
      }
      
      console.log("Calculated leasing cost:", calculatedLeasingCost, "Final adjusted cost:", finalLeasingCost);
      setIsUpdatingFromLeasingCost(true);
      setLeasingCost(finalLeasingCost);
    }
  }, [selectedMachineId, machinePriceSEK, selectedLeasingPeriodId, selectedInsuranceId, leaseAdjustmentFactor, isUpdatingFromCreditPrice, leasingRange]);

  useEffect(() => {
    if (isUpdatingFromCreditPrice) {
      console.log("Resetting isUpdatingFromCreditPrice flag");
      setIsUpdatingFromCreditPrice(false);
      return;
    }
    
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      const calculatedCreditPrice = calculateCreditPrice(
        selectedMachine, 
        leasingCost,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      console.log("Calculated credit price from leasing cost:", calculatedCreditPrice);
      setCreditPrice(calculatedCreditPrice);
    }
    
    setIsUpdatingFromLeasingCost(false);
  }, [selectedMachineId, leasingCost, isUpdatingFromCreditPrice, machinePriceSEK, selectedLeasingPeriodId]);

  const handleCreditPriceChange = (newCreditPrice: number) => {
    console.log("Credit price manually changed to:", newCreditPrice);
    
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      setCreditPrice(newCreditPrice);
      
      let newLeasingCost = 0;
      
      if (selectedMachine.creditMin !== undefined && 
          selectedMachine.creditMax !== undefined && 
          selectedMachine.leasingMin !== undefined && 
          selectedMachine.leasingMax !== undefined) {
        
        const creditRange = selectedMachine.creditMax - selectedMachine.creditMin;
        if (creditRange <= 0) {
          newLeasingCost = selectedMachine.leasingMin;
        } else {
          const creditPosition = (newCreditPrice - selectedMachine.creditMin) / creditRange;
          const clampedCreditPosition = Math.max(0, Math.min(1, creditPosition));
          const inverseCreditPosition = 1 - clampedCreditPosition;
          const leasingRange = selectedMachine.leasingMax - selectedMachine.leasingMin;
          newLeasingCost = selectedMachine.leasingMin + (inverseCreditPosition * leasingRange);
          
          console.log("Calculated new leasing cost from credit price:", 
            {newCreditPrice, creditPosition, clampedCreditPosition, inverseCreditPosition, newLeasingCost});
          
          if (newCreditPrice >= selectedMachine.creditMax) {
            newLeasingCost = selectedMachine.leasingMin;
          } else if (newCreditPrice <= selectedMachine.creditMin) {
            newLeasingCost = selectedMachine.leasingMax;
          }
        }
      } else {
        newLeasingCost = 1000000 / (newCreditPrice * selectedMachine.creditPriceMultiplier);
        console.log("Calculated leasing cost from credit price using inverse multiplier:", newLeasingCost);
      }
      
      const leasingDiff = leasingRange.max - leasingRange.min;
      if (leasingDiff > 0) {
        const newFactor = (newLeasingCost - leasingRange.min) / leasingDiff;
        const clampedFactor = Math.max(0, Math.min(1, newFactor));
        
        console.log("New adjustment factor from credit price:", clampedFactor);
        setIsUpdatingFromCreditPrice(true);
        setLeaseAdjustmentFactor(clampedFactor);
        setLeasingCost(newLeasingCost);
      } else {
        setIsUpdatingFromCreditPrice(true);
        setLeasingCost(newLeasingCost);
      }
    }
  };

  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine) {
      const useFlatrateOption = shouldUseFlatrate(
        selectedMachine,
        leasingCost,
        treatmentsPerDay,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      console.log(`Using flatrate: ${useFlatrateOption} (leasingCost: ${leasingCost}, treatmentsPerDay: ${treatmentsPerDay})`);
      
      const calculatedOperatingCost = calculateOperatingCost(
        selectedMachine,
        treatmentsPerDay,
        creditPrice,
        leasingCost,
        selectedLeasingPeriodId,
        machinePriceSEK
      );
      
      setOperatingCost(calculatedOperatingCost);
    }
  }, [selectedMachineId, treatmentsPerDay, creditPrice, leasingCost, machinePriceSEK, selectedLeasingPeriodId]);

  useEffect(() => {
    const calculatedRevenue = calculateRevenue(customerPrice, treatmentsPerDay);
    setRevenue(calculatedRevenue);
    
    const calculatedOccupancyRevenues = calculateOccupancyRevenues(calculatedRevenue.yearlyRevenueIncVat);
    setOccupancyRevenues(calculatedOccupancyRevenues);
  }, [customerPrice, treatmentsPerDay]);

  useEffect(() => {
    const totalMonthlyCostExVat = leasingCost + operatingCost.costPerMonth;
    
    const calculatedNetResults = calculateNetResults(
      revenue.monthlyRevenueExVat,
      revenue.yearlyRevenueExVat,
      totalMonthlyCostExVat
    );
    
    setNetResults(calculatedNetResults);
  }, [revenue, leasingCost, operatingCost]);

  const selectedMachine = machineData.find(machine => machine.id === selectedMachineId) || machineData[0];

  useEffect(() => {
    console.log("Leasing cost values:", {
      minLeaseCost: leasingRange.min,
      maxLeaseCost: leasingRange.max,
      leaseCost: leasingCost,
      actualLeasingCost: leasingCost,
      roundedMinCost: Math.round(leasingRange.min / 500) * 500,
      roundedMaxCost: Math.round(leasingRange.max / 500) * 500,
      numSteps: Math.floor((leasingRange.max - leasingRange.min) / 100),
      currentStepFactor: 1 / Math.max(1, Math.floor((leasingRange.max - leasingRange.min) / 100)),
      adjustmentFactor: leaseAdjustmentFactor
    });
  }, [leasingRange, leasingCost, leaseAdjustmentFactor]);

  const value = {
    clinicSize,
    setClinicSize,
    selectedMachineId,
    setSelectedMachineId,
    selectedMachine,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    treatmentsPerDay,
    setTreatmentsPerDay,
    customerPrice,
    setCustomerPrice,
    exchangeRate,
    machinePriceSEK,
    leasingRange,
    leasingCost,
    creditPrice,
    handleCreditPriceChange,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    flatrateThreshold,
    operatingCost,
    revenue,
    occupancyRevenues,
    netResults,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};
