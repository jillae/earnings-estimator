
import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { machineData } from '@/data/machines';
import ClinicSizeSelector from '../ClinicSizeSelector';
import TreatmentSettings from '../TreatmentSettings';
import MachineSelector from '../MachineSelector';
import OperatingCosts from '../OperatingCosts';
import LeaseAdjuster from '../LeaseAdjuster';
import LeasingOptions from '../LeasingOptions';
import FlatrateSection from './FlatrateSection';
import PaymentOptionToggle from './PaymentOptionToggle';
import DriftpaketSelector from './DriftpaketSelector';
import ContextualInfoBox from './ContextualInfoBox';
import { formatCurrency } from '@/utils/formatUtils';
import { leasingPeriods, insuranceOptions } from '@/data/machines'; 
import FloatingResultsSummary from './FloatingResultsSummary';
import CreditInfoPopover from './CreditInfoPopover';
import { SliderStep } from '@/utils/sliderSteps';

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
    currentSliderStep,
    setCurrentSliderStep,
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
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Investeringskostnad</div>
              {/* Diskret Credits-info endast för credit-maskiner */}
              {selectedMachine?.usesCredits && (
                <CreditInfoPopover />
              )}
            </div>
            
            <PaymentOptionToggle />
            
            {paymentOption === 'leasing' ? (
              <>
                <LeaseAdjuster
                  minLeaseCost={leasingRange.min}
                  maxLeaseCost={leasingRange.max}
                  leaseCost={leasingCost}
                  currentSliderStep={currentSliderStep}
                  flatrateThreshold={flatrateThreshold}
                  showFlatrateIndicator={selectedMachine?.usesCredits}
                  treatmentsPerDay={treatmentsPerDay}
                  onSliderStepChange={setCurrentSliderStep}
                  allowBelowFlatrate={allowBelowFlatrate}
                  onAllowBelowFlatrateChange={setAllowBelowFlatrate}
                />
                
                <LeasingOptions
                  leasingPeriods={leasingPeriods}
                  insuranceOptions={insuranceOptions}
                  selectedLeasingPeriodId={selectedLeasingPeriodId}
                  selectedInsuranceId={selectedInsuranceId}
                  onLeasingPeriodChange={setSelectedLeasingPeriodId}
                  onInsuranceChange={setSelectedInsuranceId}
                />
              </>
            ) : (
              <div className="mt-4">
                <div className="text-sm text-slate-700 mb-2">Kontantpris</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(cashPriceSEK, false, true)}</div>
                <div className="text-xs text-slate-500 mt-1">exkl. moms, inkl. frakt & installation</div>
              </div>
            )}
          </div>
          
          {/* Flatrate-sektion kommer efter anpassning av investering */}
          <FlatrateSection />
          
          <OperatingCosts />
          
          <div className="mt-4">
            <DriftpaketSelector />
            
            {/* Lägg till ContextualInfoBox här i driftssektionen */}
            <div className="mt-2">
              <ContextualInfoBox />
            </div>
          </div>
        </>
      )}
      
      <FloatingResultsSummary />
    </div>
  );
};

export default CalculatorInputs;
