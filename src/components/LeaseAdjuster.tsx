
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import CostDisplay from './lease-adjuster/CostDisplay';
import LeaseSlider from './lease-adjuster/LeaseSlider';
import LeasingModelSelector from './lease-adjuster/LeasingModelSelector';
import FlatrateTooltip from './lease-adjuster/FlatrateTooltip';
import { Info, CreditCard, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { useCalculator } from '@/context/CalculatorContext';
import { SliderStep } from '@/utils/sliderSteps';

interface LeaseAdjusterProps {
  minLeaseCost: number;
  maxLeaseCost: number;
  leaseCost: number;
  currentSliderStep: SliderStep;
  flatrateThreshold?: number;
  showFlatrateIndicator?: boolean;
  treatmentsPerDay?: number;
  onSliderStepChange: (step: SliderStep) => void;
  allowBelowFlatrate?: boolean;
  onAllowBelowFlatrateChange?: (allow: boolean) => void;
}

const LeaseAdjuster: React.FC<LeaseAdjusterProps> = ({
  minLeaseCost,
  maxLeaseCost,
  leaseCost,
  currentSliderStep,
  flatrateThreshold,
  showFlatrateIndicator = false,
  treatmentsPerDay = 0,
  onSliderStepChange,
  allowBelowFlatrate = true,
  onAllowBelowFlatrateChange
}) => {
  const { toast } = useToast();
  const { 
    calculatedCreditPrice, 
    selectedMachine, 
    stepValues, 
    selectedLeasingModel, 
    setSelectedLeasingModel 
  } = useCalculator();
  const [isAdjustmentEnabled, setIsAdjustmentEnabled] = useState(false);

  // Säkerställ att kostnadsvärden alltid är 0 när ingen maskin är vald
  const noMachineSelected = !selectedMachine || selectedMachine.id === 'null-machine' || selectedMachine.id === 'select-machine';
  const exactMinCost = noMachineSelected ? 0 : minLeaseCost;
  const exactMaxCost = noMachineSelected ? 0 : maxLeaseCost;
  
  // För strategisk leasing, visa fast kostnad från maskindata
  let displayLeaseCost = noMachineSelected ? 0 : leaseCost;
  if (selectedLeasingModel === 'strategisk' && !noMachineSelected && selectedMachine.leasingMax) {
    // Använd verklig strategisk kostnad från maskindata (t.ex. 33 863 kr för Emerald)
    displayLeaseCost = selectedMachine.leasingMax;
  }
  
  // Beräkna defaultCost korrekt baserat på tillgänglig data
  const defaultCost = noMachineSelected 
    ? 0 
    : (stepValues[1]?.leasingCost || ((exactMinCost + exactMaxCost) / 2));

  // Kontrollera om maskinen använder credits (för att visa/dölja slider och anpassningskontroll)
  const usesCredits = selectedMachine?.usesCredits || false;
  
  // Bara visa slidern för maskiner som använder credits
  const showSlider = usesCredits;
  
  // Bara visa min/max för maskiner som använder credits
  const showMinMax = usesCredits;

  // Beräkna position för flatrate-indikatorn (om den ska visas)
  let flatratePosition = null;
  if (flatrateThreshold && !noMachineSelected && usesCredits) {
    flatratePosition = ((flatrateThreshold - exactMinCost) / Math.max(0.001, exactMaxCost - exactMinCost)) * 100;
    flatratePosition = Math.max(0, Math.min(100, flatratePosition));
  }

  // När komponenterna renderas, sätt slidern till 1 (standard/mitten) för credit-maskiner
  useEffect(() => {
    if (usesCredits && currentSliderStep !== 1) {
      console.log(`Återställer slider för ${selectedMachine?.name} till standardposition (1)`);
      onSliderStepChange(1);
    }
  }, [selectedMachine?.id, usesCredits]);

  const handleSliderStepChange = (step: SliderStep) => {
    onSliderStepChange(step);
    if (step < 1 && onAllowBelowFlatrateChange) {
      onAllowBelowFlatrateChange(false);
    }
  };

  const handleToggleAdjustment = (checked: boolean) => {
    setIsAdjustmentEnabled(checked);
    if (!checked) {
      handleSliderStepChange(1);
    }
  };

  // Logga värdena för felsökning
  useEffect(() => {
    console.log(`LeaseAdjuster värden:
      selectedMachine: ${selectedMachine?.name || 'Ingen maskin vald'}
      minLeaseCost: ${minLeaseCost}, exactMinCost: ${exactMinCost}
      maxLeaseCost: ${maxLeaseCost}, exactMaxCost: ${exactMaxCost}
      leaseCost: ${leaseCost}, displayLeaseCost: ${displayLeaseCost}
      defaultCost: ${defaultCost}
      noMachineSelected: ${noMachineSelected}
      usesCredits: ${usesCredits}
      showSlider: ${showSlider}
      showMinMax: ${showMinMax}
      currentSliderStep: ${currentSliderStep}
    `);
  }, [selectedMachine, minLeaseCost, maxLeaseCost, leaseCost, exactMinCost, exactMaxCost, displayLeaseCost, defaultCost, noMachineSelected, usesCredits, showSlider, showMinMax, currentSliderStep]);

  const currentStepLabel = stepValues[currentSliderStep]?.label || 'Standard';

  return (
    <section className="bg-white rounded-2xl border border-blue-100 shadow-subtle p-5 flex flex-col gap-6 animate-slide-in" style={{ animationDelay: '150ms' }}>
      <div>
        <label className="flex items-center justify-between text-base font-semibold mb-2">
          <span>Månadskostnad leasing</span>
          {showSlider && <span className="text-sm font-medium text-blue-600">{currentStepLabel}</span>}
        </label>
        <CostDisplay 
          minLeaseCost={exactMinCost}
          maxLeaseCost={exactMaxCost}
          leaseCost={displayLeaseCost}
          showMinMax={showMinMax}
        />
      </div>
      <div className="flex flex-col md:flex-row items-stretch gap-3 w-full">
        {/* Rekommenderat pris - vi visar alltid detta oavsett maskintyp */}
        <div className="flex flex-1 items-center text-sm bg-blue-50 p-2 rounded-md gap-2 shadow-inner border border-blue-100">
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
          <span>
            Rekommenderat pris:
            <span className="font-semibold ml-1">{formatCurrency(defaultCost)}</span>
          </span>
        </div>
        {/* Kreditkostnad-indikator för grundleasing */}
        {selectedMachine?.usesCredits && selectedLeasingModel === 'grundleasing' && (
          <div className="flex flex-1 items-center text-sm bg-green-50 p-2 rounded-md gap-2 shadow-inner border border-emerald-100">
            {currentSliderStep <= 1 ? (
              <TrendingDown className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <span>
              Credit-kostnad:&nbsp;
              <span className="font-semibold">{formatCurrency(calculatedCreditPrice)}/credit</span>
            </span>
          </div>
        )}
        
        {/* Strategisk leasing indikator */}
        {selectedMachine?.usesCredits && selectedLeasingModel === 'strategisk' && (
          <div className="flex flex-1 items-center text-sm bg-primary/10 p-2 rounded-md gap-2 shadow-inner border border-primary/20">
            <CreditCard className="w-5 h-5 text-primary shrink-0" />
            <span className="font-semibold text-primary">
              Credits ingår i priset - inga extra kostnader
            </span>
          </div>
        )}
      </div>
      
      {/* Leasingmodellval - visas endast för maskiner som använder credits */}
      {usesCredits && (
        <LeasingModelSelector
          selectedModel={selectedLeasingModel}
          onModelChange={setSelectedLeasingModel}
          currentSliderStep={currentSliderStep}
        />
      )}

      {/* Finjusteringsslider - visas endast i grundleasing-läge */}
      {usesCredits && selectedLeasingModel === 'grundleasing' && (
        <LeaseSlider 
          currentStep={currentSliderStep}
          onStepChange={handleSliderStepChange}
          thresholdPosition={flatratePosition}
          showFlatrateIndicator={showFlatrateIndicator && !!selectedMachine && !noMachineSelected}
          allowBelowFlatrate={allowBelowFlatrate}
          isAdjustmentEnabled={usesCredits ? isAdjustmentEnabled : false}
          onToggleAdjustment={handleToggleAdjustment}
          showAdjustmentCheckbox={false}
          showSlider={showSlider}
          isGrundleasingMode={selectedLeasingModel === 'grundleasing'}
        />
      )}
    </section>
  );
};

export default LeaseAdjuster;
