
import React from 'react';
import ClinicSizeSelector from '../ClinicSizeSelector';
import TreatmentSettings from '../TreatmentSettings';
import MachineSelector from '../MachineSelector';
import OperatingCosts from '../OperatingCosts';
import LeaseAdjuster from '../LeaseAdjuster';
import LeasingOptions from '../LeasingOptions';
import { useCalculator } from '@/context/CalculatorContext';
import { machineData, leasingPeriods, insuranceOptions } from '@/data/machines';
import { formatCurrency } from '@/utils/formatUtils';

const CalculatorInputs: React.FC = () => {
  const {
    clinicSize,
    setClinicSize,
    selectedMachineId,
    setSelectedMachineId,
    treatmentsPerDay,
    setTreatmentsPerDay,
    customerPrice,
    setCustomerPrice,
    netResults,
    selectedMachine,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    leasingRange,
    leasingCost,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    allowBelowFlatrate,
    setAllowBelowFlatrate,
    flatrateThreshold,
    useFlatrateOption,
    setUseFlatrateOption
  } = useCalculator();
  
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

      <MachineSelector 
        machines={machineData}
        selectedMachineId={selectedMachineId}
        onChange={setSelectedMachineId}
      />

      {selectedMachine && (
        <>
          <LeasingOptions
            leasingPeriods={leasingPeriods}
            insuranceOptions={insuranceOptions}
            selectedLeasingPeriodId={selectedLeasingPeriodId}
            selectedInsuranceId={selectedInsuranceId}
            onLeasingPeriodChange={setSelectedLeasingPeriodId}
            onInsuranceChange={setSelectedInsuranceId}
          />
          
          <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '250ms' }}>
            <div className="text-sm text-slate-700 mb-2">Grundläggande leasing</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(leasingCost)}</div>
            <div className="text-xs text-slate-500 mt-1">per månad exkl. moms</div>
          </div>
          
          <LeaseAdjuster
            minLeaseCost={leasingRange.min}
            maxLeaseCost={leasingRange.max}
            leaseCost={leasingCost}
            adjustmentFactor={leaseAdjustmentFactor}
            flatrateThreshold={flatrateThreshold}
            showFlatrateIndicator={selectedMachine?.usesCredits}
            treatmentsPerDay={treatmentsPerDay}
            onAdjustmentChange={setLeaseAdjustmentFactor}
            allowBelowFlatrate={allowBelowFlatrate}
            onAllowBelowFlatrateChange={setAllowBelowFlatrate}
          />
        </>
      )}

      <OperatingCosts />
    </div>
  );
};

export default CalculatorInputs;
