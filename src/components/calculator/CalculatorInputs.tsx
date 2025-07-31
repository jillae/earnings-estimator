
import React, { useState } from 'react';
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
import { SlaCardsMatrix } from '../SlaCardsMatrix';
import ContextualInfoBox from './ContextualInfoBox';
import { formatCurrency } from '@/utils/formatUtils';
import { leasingPeriods, insuranceOptions } from '@/data/machines'; 
import FloatingResultsSummary from './FloatingResultsSummary';

import { SliderStep } from '@/utils/sliderSteps';

const CalculatorInputs: React.FC<{ 
  hoveredInput: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null;
  onHoveredInputChange: (input: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null) => void;
}> = ({ hoveredInput, onHoveredInputChange }) => {
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
    <div className="w-full space-y-6">
      {selectedMachine ? (
        <>
          {/* Nästa steg banner */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-3 text-center animate-slide-in">
            <div className="text-sm font-medium text-primary">
              🎯 Perfekt! Nu anpassar vi {selectedMachine.name} för din klinik
            </div>
          </div>

          {/* Steg 2: Klinikstorlek */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-3 mb-4 text-center">
            <div className="text-sm font-medium text-primary">
              🏥 Bestäm klinikens storlek och arbetsdagar
            </div>
          </div>
          <ClinicSizeSelector 
            clinicSize={clinicSize} 
            netYearlyResult={netResults?.netPerYearExVat || 0}
            onChange={setClinicSize}
            hoveredInput={hoveredInput}
            onHoveredInputChange={onHoveredInputChange}
          />

          {/* Steg 3: Behandlingsvolym */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-3 mb-4 text-center">
            <div className="text-sm font-medium text-primary">
              📊 Ställ in behandlingsvolym och prismodell
            </div>
          </div>
          <div className="glass-card animate-slide-in" style={{ animationDelay: '200ms' }}>
            <TreatmentSettings 
              treatmentsPerDay={treatmentsPerDay}
              customerPrice={customerPrice}
              onTreatmentsChange={setTreatmentsPerDay}
              onCustomerPriceChange={setCustomerPrice}
              hoveredInput={hoveredInput}
              onHoveredInputChange={onHoveredInputChange}
            />
          </div>

          {/* Växla maskin */}
          <MachineSelector 
            machines={machineData}
            selectedMachineId={selectedMachineId}
            onChange={setSelectedMachineId}
          />

          {/* Steg 4: Betalning */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-3 mb-4 text-center">
            <div className="text-sm font-medium text-primary">
              💰 Välj finansieringsmodell - leasing eller kontant
            </div>
          </div>
          <div className="glass-card animate-slide-in" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Investeringskostnad</div>
            </div>
            
            <PaymentOptionToggle 
              hoveredInput={hoveredInput}
              onHoveredInputChange={onHoveredInputChange}
            />
            {paymentOption === 'leasing' ? (
              <div className="mt-4 space-y-4">
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
                  hoveredInput={hoveredInput}
                  onHoveredInputChange={onHoveredInputChange}
                />
                
                
                <LeasingOptions
                  leasingPeriods={leasingPeriods}
                  insuranceOptions={insuranceOptions}
                  selectedLeasingPeriodId={selectedLeasingPeriodId}
                  selectedInsuranceId={selectedInsuranceId}
                  onLeasingPeriodChange={setSelectedLeasingPeriodId}
                  onInsuranceChange={setSelectedInsuranceId}
                />
              </div>
            ) : (
              <div className="mt-4">
                <div className="text-sm text-slate-700 mb-2">Kontantpris</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(cashPriceSEK, false, true)}</div>
                <div className="text-xs text-slate-500 mt-1">exkl. moms, inkl. frakt & installation</div>
              </div>
            )}
          </div>
          

          {/* Flatrate-sektion */}
          <FlatrateSection />
          
          {/* Steg 5: Service & SLA */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-3 mb-4 text-center">
            <div className="text-sm font-medium text-primary">
              🛠️ Välj servicenivå och driftpaket
            </div>
          </div>
          <SlaCardsMatrix 
            hoveredInput={hoveredInput}
            onHoveredInputChange={onHoveredInputChange}
          />
          
          <OperatingCosts />

          {/* Klart banner */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 text-center animate-slide-in">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🎉</span>
              <span className="text-lg font-bold text-primary">Beräkning klar!</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Se ditt resultat i högra kolumnen →
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-slate-600 mb-2">👆</div>
          <div className="text-sm font-medium text-slate-700">
            Välj din maskin ovan för att börja beräkningen
          </div>
        </div>
      )}
      
      <FloatingResultsSummary />
    </div>
  );
};

export default CalculatorInputs;
