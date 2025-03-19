
import React from 'react';
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
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    flatrateThreshold,
    operatingCost,
    creditPrice,
    netResults
  } = useCalculator();

  // Get current machine
  const isCreditsEnabledMachine = selectedMachine.usesCredits;
  // Only show credit-related fields if a real machine is selected (not "select-machine")
  const showCreditFields = selectedMachineId !== "select-machine" && isCreditsEnabledMachine;

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
            onAdjustmentChange={setLeaseAdjustmentFactor}
          />
        )}
        
        {showCreditFields && (
          <OperatingCosts 
            usesCredits={isCreditsEnabledMachine}
            useFlatrate={operatingCost.useFlatrate}
            creditPrice={creditPrice}
            flatrateAmount={selectedMachine.flatrateAmount}
            operatingCostPerMonth={operatingCost.costPerMonth}
          />
        )}
      </div>
    </div>
  );
};

export default CalculatorInputs;
