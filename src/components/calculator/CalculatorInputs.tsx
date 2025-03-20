
import React from 'react';
import { useCalculator } from '@/context/calculator/context';
import { machineData, leasingPeriods, insuranceOptions } from '@/data/machines';
import MachineSelector from '../MachineSelector';
import LeasingOptions from '../LeasingOptions';
import LeaseAdjuster from '../LeaseAdjuster';
import OperatingCosts from '../OperatingCosts';
import TreatmentSettings from '../TreatmentSettings';

const CalculatorInputs: React.FC = () => {
  const {
    selectedMachineId,
    setSelectedMachineId,
    selectedMachine,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    leasingRange,
    leasingCost,
    treatmentsPerDay,
    setTreatmentsPerDay,
    customerPrice,
    setCustomerPrice,
    operatingCost,
    creditPrice,
  } = useCalculator();

  return (
    <div className="calculator-inputs">
      <MachineSelector
        machines={machineData}
        selectedMachineId={selectedMachineId}
        onChange={setSelectedMachineId}
      />
      
      {selectedMachine.id !== 'null-machine' && (
        <>
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
            flatrateThreshold={leasingRange.flatrateThreshold}
            showFlatrateIndicator={selectedMachine.usesCredits}
            onAdjustmentChange={setLeaseAdjustmentFactor}
          />
          
          <OperatingCosts
            usesCredits={selectedMachine.usesCredits}
            useFlatrate={operatingCost.useFlatrate}
            creditPrice={creditPrice}
            flatrateAmount={operatingCost.flatrateAmount}
            operatingCostPerMonth={operatingCost.costPerMonth}
            treatmentsPerDay={treatmentsPerDay}
          />
          
          <TreatmentSettings
            treatmentsPerDay={treatmentsPerDay}
            customerPrice={customerPrice}
            onTreatmentsChange={setTreatmentsPerDay}
            onCustomerPriceChange={setCustomerPrice}
          />
        </>
      )}
    </div>
  );
};

export default CalculatorInputs;
