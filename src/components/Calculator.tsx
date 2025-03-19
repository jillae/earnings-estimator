
import React, { useState, useEffect } from 'react';
import ClinicSizeSelector from './ClinicSizeSelector';
import MachineSelector from './MachineSelector';
import LeasingOptions from './LeasingOptions';
import LeaseAdjuster from './LeaseAdjuster';
import OperatingCosts from './OperatingCosts';
import TreatmentSettings from './TreatmentSettings';
import ResultsTable from './ResultsTable';
import { 
  machineData, 
  leasingPeriods, 
  insuranceOptions,
  SMALL_CLINIC_TREATMENTS,
  MEDIUM_CLINIC_TREATMENTS,
  LARGE_CLINIC_TREATMENTS,
  DEFAULT_CUSTOMER_PRICE
} from '../data/machineData';
import {
  fetchExchangeRate,
  calculateMachinePriceSEK,
  calculateLeasingCost,
  calculateLeasingRange,
  calculateCreditPrice,
  calculateOperatingCost,
  calculateRevenue,
  calculateOccupancyRevenues,
  calculateNetResults
} from '../utils/calculatorUtils';

const Calculator: React.FC = () => {
  // State for clinic size
  const [clinicSize, setClinicSize] = useState<number>(2); // Default to medium
  
  // State for machine selection
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machineData[0].id);
  
  // State for leasing options - updated defaults
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>(leasingPeriods[2].id); // Default to 60 months
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>(insuranceOptions[1].id); // Default to "yes"
  
  // State for lease adjustment
  const [leaseAdjustmentFactor, setLeaseAdjustmentFactor] = useState<number>(0.5);
  
  // State for treatment settings
  const [treatmentsPerDay, setTreatmentsPerDay] = useState<number>(MEDIUM_CLINIC_TREATMENTS);
  const [customerPrice, setCustomerPrice] = useState<number>(DEFAULT_CUSTOMER_PRICE);
  
  // State for calculations
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
  
  // Fetch exchange rate on component mount
  useEffect(() => {
    const getExchangeRate = async () => {
      const rate = await fetchExchangeRate();
      console.log("Fetched exchange rate:", rate);
      setExchangeRate(rate);
    };
    
    getExchangeRate();
  }, []);
  
  // Update treatments per day when clinic size changes
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
  
  // Calculate machine price when machine or exchange rate changes
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    if (selectedMachine) {
      const priceSEK = calculateMachinePriceSEK(selectedMachine, exchangeRate);
      console.log("Machine price in SEK:", priceSEK);
      setMachinePriceSEK(priceSEK);
    }
  }, [selectedMachineId, exchangeRate]);
  
  // Calculate leasing range when machine price, leasing period, or insurance changes
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
      
      // Reset adjustment factor to middle when range changes
      setLeaseAdjustmentFactor(0.5);
    }
  }, [selectedMachineId, machinePriceSEK, selectedLeasingPeriodId, selectedInsuranceId]);
  
  // Calculate leasing cost when range or adjustment factor changes
  useEffect(() => {
    if (isUpdatingFromCreditPrice) return; // Skip if update is coming from credit price change
    
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    const selectedLeasingPeriod = leasingPeriods.find(period => period.id === selectedLeasingPeriodId);
    const includeInsurance = selectedInsuranceId === 'yes';
    
    if (selectedMachine && selectedLeasingPeriod) {
      // Map leaseAdjustmentFactor from 0-1 to minLeaseMultiplier-maxLeaseMultiplier
      const actualMultiplier = selectedMachine.minLeaseMultiplier + 
        leaseAdjustmentFactor * 
        (selectedMachine.maxLeaseMultiplier - selectedMachine.minLeaseMultiplier);
      
      console.log("Using multiplier for leasing cost:", actualMultiplier);
      
      const calculatedLeasingCost = calculateLeasingCost(
        selectedMachine,
        machinePriceSEK,
        selectedLeasingPeriod.rate,
        includeInsurance,
        actualMultiplier
      );
      
      console.log("Calculated leasing cost:", calculatedLeasingCost);
      setIsUpdatingFromLeasingCost(true);
      setLeasingCost(calculatedLeasingCost);
    }
  }, [selectedMachineId, machinePriceSEK, selectedLeasingPeriodId, selectedInsuranceId, leaseAdjustmentFactor, isUpdatingFromCreditPrice]);
  
  // Calculate credit price when leasing cost changes
  useEffect(() => {
    if (isUpdatingFromCreditPrice) {
      setIsUpdatingFromCreditPrice(false);
      return;
    }
    
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      const calculatedCreditPrice = calculateCreditPrice(selectedMachine, leasingCost);
      console.log("Calculated credit price from leasing cost:", calculatedCreditPrice);
      setCreditPrice(calculatedCreditPrice);
    }
    
    setIsUpdatingFromLeasingCost(false);
  }, [selectedMachineId, leasingCost, isUpdatingFromCreditPrice]);
  
  // Handle direct credit price changes
  const handleCreditPriceChange = (newCreditPrice: number) => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine && selectedMachine.usesCredits) {
      setCreditPrice(newCreditPrice);
      
      // Calculate what leasing cost would generate this credit price
      const newLeasingCost = newCreditPrice / selectedMachine.creditPriceMultiplier;
      console.log("Calculated leasing cost from credit price:", newLeasingCost);
      
      // Find what adjustment factor would lead to this leasing cost
      const leasingDiff = leasingRange.max - leasingRange.min;
      if (leasingDiff > 0) {
        const newFactor = (newLeasingCost - leasingRange.min) / leasingDiff;
        const clampedFactor = Math.max(0, Math.min(1, newFactor));
        
        console.log("New adjustment factor from credit price:", clampedFactor);
        setIsUpdatingFromCreditPrice(true);
        setLeaseAdjustmentFactor(clampedFactor);
        setLeasingCost(newLeasingCost);
      }
    }
  };
  
  // Calculate operating cost when treatments per day or credit price changes
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine) {
      const calculatedOperatingCost = calculateOperatingCost(
        selectedMachine,
        treatmentsPerDay,
        creditPrice
      );
      
      setOperatingCost(calculatedOperatingCost);
    }
  }, [selectedMachineId, treatmentsPerDay, creditPrice]);
  
  // Calculate revenue when customer price or treatments per day changes
  useEffect(() => {
    const calculatedRevenue = calculateRevenue(customerPrice, treatmentsPerDay);
    setRevenue(calculatedRevenue);
    
    // Also update occupancy revenues
    const calculatedOccupancyRevenues = calculateOccupancyRevenues(calculatedRevenue.yearlyRevenueIncVat);
    setOccupancyRevenues(calculatedOccupancyRevenues);
  }, [customerPrice, treatmentsPerDay]);
  
  // Calculate net results when revenue and costs change
  useEffect(() => {
    const totalMonthlyCostExVat = leasingCost + operatingCost.costPerMonth;
    
    const calculatedNetResults = calculateNetResults(
      revenue.monthlyRevenueExVat,
      revenue.yearlyRevenueExVat,
      totalMonthlyCostExVat
    );
    
    setNetResults(calculatedNetResults);
  }, [revenue, leasingCost, operatingCost]);
  
  // Get the selected machine
  const selectedMachine = machineData.find(machine => machine.id === selectedMachineId) || machineData[0];
  
  return (
    <div className="container">
      <div className="calculator-grid">
        <div>
          <ClinicSizeSelector 
            clinicSize={clinicSize} 
            netYearlyResult={netResults.netPerYearExVat}
            onChange={setClinicSize} 
          />
          
          {/* Move TreatmentSettings here - after clinic size and before machine selection */}
          <div className="glass-card mt-4">
            <TreatmentSettings 
              treatmentsPerDay={treatmentsPerDay}
              customerPrice={customerPrice}
              onTreatmentsChange={setTreatmentsPerDay}
              onCustomerPriceChange={setCustomerPrice}
            />
          </div>
          
          <div className="glass-card mt-6">
            <MachineSelector 
              machines={machineData} 
              selectedMachineId={selectedMachineId} 
              onChange={setSelectedMachineId} 
            />
            
            <LeasingOptions 
              leasingPeriods={leasingPeriods}
              insuranceOptions={insuranceOptions}
              selectedLeasingPeriodId={selectedLeasingPeriodId}
              selectedInsuranceId={selectedInsuranceId}
              onLeasingPeriodChange={setSelectedLeasingPeriodId}
              onInsuranceChange={setSelectedInsuranceId}
            />
            
            <LeaseAdjuster 
              minLeaseCost={leasingRange.min}
              maxLeaseCost={leasingRange.max}
              leaseCost={leasingCost}
              adjustmentFactor={leaseAdjustmentFactor}
              onAdjustmentChange={setLeaseAdjustmentFactor}
            />
            
            <OperatingCosts 
              usesCredits={selectedMachine.usesCredits}
              useFlatrate={operatingCost.useFlatrate}
              creditPrice={creditPrice}
              flatrateAmount={selectedMachine.flatrateAmount}
              operatingCostPerMonth={operatingCost.costPerMonth}
              onCreditPriceChange={handleCreditPriceChange}
            />
          </div>
        </div>
        
        <div>
          <ResultsTable 
            dailyRevenueIncVat={revenue.dailyRevenueIncVat}
            weeklyRevenueIncVat={revenue.weeklyRevenueIncVat}
            monthlyRevenueIncVat={revenue.monthlyRevenueIncVat}
            yearlyRevenueIncVat={revenue.yearlyRevenueIncVat}
            leasingCostPerMonth={leasingCost}
            operatingCostPerMonth={operatingCost.costPerMonth}
            netPerMonthExVat={netResults.netPerMonthExVat}
            netPerYearExVat={netResults.netPerYearExVat}
            occupancy50={occupancyRevenues.occupancy50}
            occupancy75={occupancyRevenues.occupancy75}
            occupancy100={occupancyRevenues.occupancy100}
          />
        </div>
      </div>
    </div>
  );
};

export default Calculator;
