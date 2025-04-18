
import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { machineData } from '@/data/machines';
import ClinicSizeSelector from '../ClinicSizeSelector';
import TreatmentSettings from '../TreatmentSettings';
import MachineSelector from '../MachineSelector';
import OperatingCosts from '../OperatingCosts';
import LeaseAdjuster from '../LeaseAdjuster';
import LeasingOptions from '../LeasingOptions';
import PaymentOptionToggle from './PaymentOptionToggle';
import DriftpaketSelector from './DriftpaketSelector';
import { formatCurrency } from '@/utils/formatUtils';
import { leasingPeriods, insuranceOptions } from '@/data/machines'; 

const CalculatorInputs: React.FC = () => {
  const {
    clinicSize,
    setClinicSize,
    selectedMachineId,
    setSelectedMachineId,
    selectedMachine,
    paymentOption,
    treatmentsPerDay,
    customerPrice,
    setTreatmentsPerDay,
    setCustomerPrice,
    leasingCost,
    leasingRange,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    flatrateThreshold,
    allowBelowFlatrate,
    setAllowBelowFlatrate,
    cashPriceSEK,
    selectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedLeasingPeriodId,
    setSelectedInsuranceId,
    netResults
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
          <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '250ms' }}>
            <div className="text-lg font-semibold mb-4">Investeringskostnad</div>
            
            <PaymentOptionToggle />
            
            {paymentOption === 'leasing' ? (
              <>
                <LeasingOptions
                  leasingPeriods={leasingPeriods}
                  insuranceOptions={insuranceOptions}
                  selectedLeasingPeriodId={selectedLeasingPeriodId}
                  selectedInsuranceId={selectedInsuranceId}
                  onLeasingPeriodChange={setSelectedLeasingPeriodId}
                  onInsuranceChange={setSelectedInsuranceId}
                />
                
                <div className="mt-4">
                  <div className="text-sm text-slate-700 mb-2">Månadskostnad leasing</div>
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
            ) : (
              <div className="mt-4">
                <div className="text-sm text-slate-700 mb-2">Kontantpris</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(cashPriceSEK)}</div>
                <div className="text-xs text-slate-500 mt-1">exkl. moms, inkl. frakt & installation</div>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <DriftpaketSelector />
          </div>
          
          <OperatingCosts />
        </>
      )}
    </div>
  );
};

export default CalculatorInputs;
