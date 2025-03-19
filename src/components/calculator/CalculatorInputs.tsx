
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
    handleCreditPriceChange,
    netResults
  } = useCalculator();

  return (
    <div className="w-full">
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
        
        {selectedMachine.usesCredits && (
          <LeaseAdjuster 
            minLeaseCost={leasingRange.min}
            maxLeaseCost={leasingRange.max}
            leaseCost={leasingCost}
            adjustmentFactor={leaseAdjustmentFactor}
            flatrateThreshold={flatrateThreshold}
            showFlatrateIndicator={selectedMachine.usesCredits}
            onAdjustmentChange={setLeaseAdjustmentFactor}
          />
        )}
        
        {selectedMachine.usesCredits && !operatingCost.useFlatrate && (
          <OperatingCosts 
            usesCredits={selectedMachine.usesCredits}
            useFlatrate={operatingCost.useFlatrate}
            creditPrice={creditPrice}
            flatrateAmount={selectedMachine.flatrateAmount}
            operatingCostPerMonth={operatingCost.costPerMonth}
            onCreditPriceChange={handleCreditPriceChange}
          />
        )}
        
        {selectedMachine.usesCredits && operatingCost.useFlatrate && (
          <OperatingCosts 
            usesCredits={selectedMachine.usesCredits}
            useFlatrate={operatingCost.useFlatrate}
            creditPrice={creditPrice}
            flatrateAmount={selectedMachine.flatrateAmount}
            operatingCostPerMonth={operatingCost.costPerMonth}
            onCreditPriceChange={undefined} // No credit price change when using flatrate
          />
        )}
      </div>
    </div>
  );
};

export default CalculatorInputs;
