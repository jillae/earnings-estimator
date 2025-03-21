
import React, { useEffect } from 'react';
import ClinicSizeSelector from '../ClinicSizeSelector';
import MachineSelector from '../MachineSelector';
import LeasingOptions from '../LeasingOptions';
import LeaseAdjuster from '../LeaseAdjuster';
import OperatingCosts from '../OperatingCosts';
import TreatmentSettings from '../TreatmentSettings';
import { useCalculator } from '@/context/CalculatorContext';
import { machineData, leasingPeriods, insuranceOptions } from './imports';

const CalculatorInputs: React.FC = () => {
  const {
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
    leasingRange,
    leasingCost,
    leasingCostPercentage,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    allowBelowFlatrate,
    setAllowBelowFlatrate,
    flatrateThreshold,
    operatingCost,
    creditPrice,
    netResults,
    useFlatrateOption,
    setUseFlatrateOption
  } = useCalculator();

  // Säkerställ att selectedMachine inte är null innan vi använder dess egenskaper
  // Om null, använd ett defaultvärde där usesCredits är false
  const isCreditsEnabledMachine = selectedMachine?.usesCredits || false;
  
  // Endast visa kreditsrelaterade fält om en riktig maskin är vald (inte "select-machine")
  const showCreditFields = selectedMachineId !== "select-machine" && isCreditsEnabledMachine;
  
  // Synkronisera inställningar när useFlatrateOption ändras
  useEffect(() => {
    if (useFlatrateOption === 'flatrate') {
      // När flatrate aktiveras, sätt allowBelowFlatrate till false
      if (allowBelowFlatrate) {
        setAllowBelowFlatrate(false);
      }
      
      // Om leasingkostnaden är under tröskeln, justera leasingkostnaden
      if (leasingCostPercentage < 80 && flatrateThreshold && leasingRange.max > leasingRange.min) {
        const flatratePosition = (flatrateThreshold - leasingRange.min) / 
                               (leasingRange.max - leasingRange.min);
        setLeaseAdjustmentFactor(flatratePosition);
      }
    } else if (useFlatrateOption === 'perCredit') {
      // När flatrate inaktiveras, sätt allowBelowFlatrate till true
      if (!allowBelowFlatrate) {
        setAllowBelowFlatrate(true);
      }
    }
  }, [useFlatrateOption, setAllowBelowFlatrate, leasingCostPercentage, 
      flatrateThreshold, leasingRange, setLeaseAdjustmentFactor, allowBelowFlatrate]);
  
  // Synkronisera useFlatrateOption när allowBelowFlatrate ändras
  useEffect(() => {
    if (!allowBelowFlatrate) {
      if (useFlatrateOption !== 'flatrate') {
        setUseFlatrateOption('flatrate');
      }
    } else {
      if (useFlatrateOption !== 'perCredit') {
        setUseFlatrateOption('perCredit');
      }
    }
  }, [allowBelowFlatrate, setUseFlatrateOption, useFlatrateOption]);

  return (
    <div className="w-full">
      <ClinicSizeSelector 
        clinicSize={clinicSize} 
        netYearlyResult={netResults.netPerYearExVat}
        onChange={setClinicSize} 
      />
      
      <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '200ms' }}>
        <TreatmentSettings 
          treatmentsPerDay={treatmentsPerDay}
          customerPrice={customerPrice}
          onTreatmentsChange={setTreatmentsPerDay}
          onCustomerPriceChange={setCustomerPrice}
        />
      </div>
      
      <div className="glass-card mt-6 animate-slide-in" style={{ animationDelay: '400ms' }}>
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
        
        {selectedMachineId !== "select-machine" && (
          <LeaseAdjuster 
            minLeaseCost={leasingRange.min}
            maxLeaseCost={leasingRange.max}
            leaseCost={leasingCost}
            adjustmentFactor={leaseAdjustmentFactor}
            flatrateThreshold={flatrateThreshold}
            showFlatrateIndicator={isCreditsEnabledMachine}
            treatmentsPerDay={treatmentsPerDay}
            onAdjustmentChange={setLeaseAdjustmentFactor}
            allowBelowFlatrate={allowBelowFlatrate}
            onAllowBelowFlatrateChange={setAllowBelowFlatrate}
          />
        )}
        
        {showCreditFields && (
          <OperatingCosts 
            usesCredits={isCreditsEnabledMachine}
            useFlatrate={operatingCost.useFlatrate} 
            creditPrice={creditPrice}
            flatrateAmount={selectedMachine?.flatrateAmount || 5996}
            operatingCostPerMonth={operatingCost.costPerMonth}
            allowBelowFlatrate={allowBelowFlatrate}
            leasingCostPercentage={leasingCostPercentage}
            treatmentsPerDay={treatmentsPerDay}
            onFlatrateOptionChange={setUseFlatrateOption}
            useFlatrateOption={useFlatrateOption}
          />
        )}
      </div>
    </div>
  );
};

export default CalculatorInputs;
