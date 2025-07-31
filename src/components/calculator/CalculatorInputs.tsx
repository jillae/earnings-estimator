
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
          {/* Välkomstbanner efter maskinval */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center animate-slide-in mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="text-lg font-bold text-green-700">Perfekt! Nu anpassar vi {selectedMachine.name} för din klinik</span>
            </div>
          </div>

          {/* Tips banner för steg 2 */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center animate-slide-in mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🏥</span>
              <span className="text-lg font-bold text-blue-700">Klinikstorlek</span>
            </div>
          </div>

          {/* Steg 2: Klinikstorlek */}
          <div className="relative">
            <div className="absolute -top-3 left-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
              STEG 2
            </div>
            <div className="glass-card animate-slide-in pt-2" style={{ animationDelay: '200ms' }}>
              <ClinicSizeSelector
                clinicSize={clinicSize} 
                netYearlyResult={netResults?.netPerYearExVat || 0}
                onChange={setClinicSize}
                hoveredInput={hoveredInput}
                onHoveredInputChange={onHoveredInputChange}
              />
            </div>
          </div>

          {/* Tips banner för steg 3 */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center animate-slide-in mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">📊</span>
              <span className="text-lg font-bold text-green-700">Ställ in behandlingsvolym</span>
            </div>
            <div className="text-sm text-green-600">
              Antal behandlingar per dag och kundpris påverkar din lönsamhet
            </div>
          </div>

          {/* Steg 3: Behandlingsvolym */}
          <div className="relative">
            <div className="absolute -top-3 left-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
              STEG 3
            </div>
            <div className="glass-card animate-slide-in pt-2" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg font-semibold mb-4">Behandlingsvolym</h3>
              <TreatmentSettings 
                treatmentsPerDay={treatmentsPerDay}
                customerPrice={customerPrice}
                onTreatmentsChange={setTreatmentsPerDay}
                onCustomerPriceChange={setCustomerPrice}
                hoveredInput={hoveredInput}
                onHoveredInputChange={onHoveredInputChange}
              />
            </div>
          </div>

          {/* Växla maskin */}
          <MachineSelector 
            machines={machineData}
            selectedMachineId={selectedMachineId}
            onChange={setSelectedMachineId}
          />

          {/* Tips banner för steg 4 */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center animate-slide-in mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">💰</span>
              <span className="text-lg font-bold text-purple-700">Välj betalningsform</span>
            </div>
            <div className="text-sm text-purple-600">
              Leasing eller kontant - efter dina preferenser. <a href="#" className="text-purple-800 underline hover:text-purple-900">Fördelarna med leasing - läs mer</a>
            </div>
          </div>

          {/* Steg 4: Betalning */}
          <div className="relative">
            <div className="absolute -top-3 left-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
              STEG 4
            </div>
            <div className="glass-card animate-slide-in pt-2" style={{ animationDelay: '250ms' }}>
              <h3 className="text-lg font-semibold mb-4">Investeringskostnad</h3>
            
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
          </div>
          

          {/* Flatrate-sektion */}
          <FlatrateSection />
          
          {/* Tips banner för steg 5 */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 text-center animate-slide-in mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🛠️</span>
              <span className="text-lg font-bold text-orange-700">Service & support</span>
            </div>
          </div>

          {/* Steg 5: Service & SLA */}
          <div className="relative">
            <div className="absolute -top-3 left-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
              STEG 5
            </div>
            <div className="glass-card animate-slide-in pt-2" style={{ animationDelay: '300ms' }}>
              <SlaCardsMatrix 
                hoveredInput={hoveredInput}
                onHoveredInputChange={onHoveredInputChange}
              />
              
              <OperatingCosts />
            </div>
          </div>

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
