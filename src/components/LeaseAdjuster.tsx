
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
import CreditInfoPopover from './calculator/CreditInfoPopover';
import RollingValueDisplay from './calculator/RollingValueDisplay';

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
  hoveredInput?: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null;
  onHoveredInputChange?: (input: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null) => void;
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
  onAllowBelowFlatrateChange,
  hoveredInput,
  onHoveredInputChange
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
  
  // KORRIGERING: För grundleasing, visa den exakta aktuella leasingkostnaden baserat på slider
  if (selectedLeasingModel === 'grundleasing' && !noMachineSelected && stepValues[currentSliderStep]) {
    displayLeaseCost = stepValues[currentSliderStep].leasingCost;
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
    <section 
      className="bg-white rounded-2xl border border-blue-100 shadow-subtle p-5 flex flex-col gap-6 animate-slide-in hover:shadow-lg transition-all duration-200" 
      style={{ animationDelay: '150ms' }}
      onMouseEnter={() => onHoveredInputChange?.('leasing')}
      onMouseLeave={() => onHoveredInputChange?.(null)}
    >
      {/* Flexibel investering FÖRST */}
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
      
      {/* Strategisk leasing indikator - behåll denna */}
      {selectedMachine?.usesCredits && selectedLeasingModel === 'strategisk' && (
        <div className="flex items-center text-sm bg-primary/10 p-2 rounded-md gap-2 shadow-inner border border-primary/20">
          <CreditCard className="w-5 h-5 text-primary shrink-0" />
          <span className="font-semibold text-primary">
            Credits ingår i priset - inga extra driftskostnader
          </span>
        </div>
      )}


      {/* Rullande visare EFTER slidern - prova olika animationer */}
      {usesCredits && selectedLeasingModel === 'grundleasing' && (
        <div className="grid grid-cols-2 gap-4">
          <RollingValueDisplay 
            value={displayLeaseCost}
            label="Rekommenderat pris"
            className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50"
            showTrendIcon={true}
            trendDirection={currentSliderStep <= 1 ? 'down' : 'up'}
            showStandardBadge={true}
            isStandardPosition={currentSliderStep === 1}
            animationStyle="rolodex"
          />
          <RollingValueDisplay 
            value={calculatedCreditPrice}
            label="Credit-kostnad: Styckepris"
            className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50"
            showTrendIcon={true}
            trendDirection={currentSliderStep <= 1 ? 'up' : 'down'}
            animationStyle="rolodex"
          />
        </div>
      )}
      
            {/* Ta bort nollpunkt från vänster kolumn - förklaring: detta är ett enkelt GUI element utan komplexitet */}
            
            {/* Leasingmodellval - visas endast för maskiner som använder credits */}
      {usesCredits && (
        <LeasingModelSelector
          selectedModel={selectedLeasingModel}
          onModelChange={setSelectedLeasingModel}
          currentSliderStep={currentSliderStep}
        />
      )}
    </section>
  );
};

export default LeaseAdjuster;
