
import React from 'react';
import ClinicSizeSelector from '../ClinicSizeSelector';
import MachineSelector from '../MachineSelector';
import LeasingOptions from '../LeasingOptions';
import LeaseAdjuster from '../LeaseAdjuster';
import OperatingCosts from '../OperatingCosts';
import TreatmentSettings from '../TreatmentSettings';
import { useCalculator } from '@/context/calculator/context';
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
    allowBelowFlatrate,
    setAllowBelowFlatrate,
    flatrateThreshold,
    operatingCost,
    useFlatrateOption,
    setUseFlatrateOption,
    netResults
  } = useCalculator();

  // Säkerställ att selectedMachine inte är null innan vi använder dess egenskaper
  // Om null, använd ett defaultvärde där usesCredits är false
  const isCreditsEnabledMachine = selectedMachine?.usesCredits || false;
  
  // Endast visa kreditsrelaterade fält om en riktig maskin är vald (inte "select-machine")
  const showCreditFields = selectedMachineId !== "select-machine" && isCreditsEnabledMachine;
  
  return (
    <div className="w-full">
      <ClinicSizeSelector 
        clinicSize={clinicSize} 
        netYearlyResult={netResults?.netPerYearExVat || 0}
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
          <OperatingCosts />
        )}
      </div>
    </div>
  );
};

export default CalculatorInputs;
