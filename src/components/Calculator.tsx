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
  const [clinicSize, setClinicSize] = useState<number>(2);
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machineData[0].id);
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>(leasingPeriods[2].id);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>(insuranceOptions[1].id);
  const [leaseAdjustmentFactor, setLeaseAdjustmentFactor] = useState<number>(1);
  const [treatmentsPerDay, setTreatmentsPerDay] = useState<number>(MEDIUM_CLINIC_TREATMENTS);
  const [customerPrice, setCustomerPrice] = useState<number>(DEFAULT_CUSTOMER_PRICE);
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
      
      setLeaseAdjustmentFactor(1);
      
      if (selectedMachine.usesCredits) {
        const threshold = range.min + (0.8 * (range.max - range.min));
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
      const calculatedCreditPrice = calculateCreditPrice(selectedMachine, leasingCost);
      console.log("Calculated credit price from leasing cost:", calculatedCreditPrice);
      setCreditPrice(calculatedCreditPrice);
    }
    
    setIsUpdatingFromLeasingCost(false);
  }, [selectedMachineId, leasingCost, isUpdatingFromCreditPrice]);

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
      const shouldUseFlatrate = selectedMachine.usesCredits && 
                               leasingCost >= flatrateThreshold && 
                               treatmentsPerDay >= 3;
      
      console.log(`Flatrate decision: leasingCost ${leasingCost} ${leasingCost >= flatrateThreshold ? '>=' : '<'} threshold ${flatrateThreshold} AND treatments ${treatmentsPerDay} ${treatmentsPerDay >= 3 ? '>=' : '<'} 3`);
      
      const calculatedOperatingCost = calculateOperatingCost(
        selectedMachine,
        treatmentsPerDay,
        creditPrice,
        shouldUseFlatrate
      );
      
      setOperatingCost(calculatedOperatingCost);
    }
  }, [selectedMachineId, treatmentsPerDay, creditPrice, leasingCost, flatrateThreshold]);

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

  return (
    <div className="container">
      <div className="calculator-grid">
        <div>
          <ClinicSizeSelector 
            clinicSize={clinicSize} 
            netYearlyResult={netResults.netPerYearExVat}
            onChange={setClinicSize} 
          />
          
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
              flatrateThreshold={flatrateThreshold}
              showFlatrateIndicator={selectedMachine.usesCredits}
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
