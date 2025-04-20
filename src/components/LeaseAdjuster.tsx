
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import CostDisplay from './lease-adjuster/CostDisplay';
import LeaseSlider from './lease-adjuster/LeaseSlider';
import { Info, CreditCard } from 'lucide-react';
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
  const { calculatedCreditPrice, selectedMachine, stepValues } = useCalculator();
  
  // State för att hantera om användaren har aktiverat slider-justering
  const [isAdjustmentEnabled, setIsAdjustmentEnabled] = useState(false);
  
  console.log("LeaseAdjuster rendering with:", {
    minLeaseCost,
    maxLeaseCost,
    leaseCost,
    currentSliderStep,
    flatrateThreshold,
    showFlatrateIndicator,
    treatmentsPerDay,
    allowBelowFlatrate,
    isAdjustmentEnabled,
    creditPrice: calculatedCreditPrice,
    machineId: selectedMachine?.id,
    machineName: selectedMachine?.name,
    machineOriginalCreditMin: selectedMachine?.creditMin,
    machineOriginalCreditMax: selectedMachine?.creditMax
  });

  const exactMinCost = minLeaseCost;
  const exactMaxCost = maxLeaseCost;
  
  const defaultCost = stepValues[1]?.leasingCost || ((exactMinCost + exactMaxCost) / 2);
  
  let flatratePosition = null;
  if (flatrateThreshold) {
    flatratePosition = ((flatrateThreshold - exactMinCost) / Math.max(0.001, exactMaxCost - exactMinCost)) * 100;
    flatratePosition = Math.max(0, Math.min(100, flatratePosition));
  }
  
  const handleSliderStepChange = (step: SliderStep) => {
    console.log(`Slider flyttad till steg: ${step}`);
    onSliderStepChange(step);
    
    // Uppdatera flatrate-tillåtelse baserat på nytt steg
    if (step < 1 && onAllowBelowFlatrateChange) {
      onAllowBelowFlatrateChange(false);
    }
  };
  
  const handleToggleAdjustment = (checked: boolean) => {
    setIsAdjustmentEnabled(checked);
    
    // Om användaren inaktiverar justering, återställ till standardläge (steg 1)
    if (!checked) {
      handleSliderStepChange(1);
    }
  };

  const isAboveFlatrateThreshold = flatrateThreshold ? leaseCost >= flatrateThreshold : false;
  
  // För visa nuvarande sliderstegets label/namn
  const currentStepLabel = stepValues[currentSliderStep]?.label || 'Standard';

  // Logga vilket kredivärde som visas för aktuellt steg
  console.log(`Nuvarande steg: ${currentSliderStep} (${currentStepLabel})`);
  console.log(`Credit-pris som visas: ${calculatedCreditPrice} kr/credit (exakt värde)`);
  console.log(`Step values för detta steg:`, stepValues[currentSliderStep]);
  
  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '300ms' }}>
      <label className="input-label flex items-center justify-between">
        <span>Justera leasingkostnad</span>
        <span className="text-sm font-medium text-blue-600">{currentStepLabel}</span>
      </label>

      <CostDisplay 
        minLeaseCost={exactMinCost}
        maxLeaseCost={exactMaxCost}
        leaseCost={leaseCost}
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-center text-sm bg-blue-50 p-2 rounded-md">
          <Info className="w-4 h-4 mr-2 text-blue-600" />
          <span>Rekommenderat pris: <span className="font-medium">{formatCurrency(defaultCost)}</span></span>
        </div>
        
        {selectedMachine?.usesCredits && (
          <div className="flex items-center justify-center text-sm bg-green-50 p-2 rounded-md">
            <CreditCard className="w-4 h-4 mr-2 text-green-600" />
            <span>Krediter per behandling: <span className="font-medium">{formatCurrency(calculatedCreditPrice)} kr/credit</span></span>
          </div>
        )}
      </div>

      <LeaseSlider 
        currentStep={currentSliderStep}
        onStepChange={handleSliderStepChange}
        thresholdPosition={flatratePosition}
        showFlatrateIndicator={showFlatrateIndicator}
        allowBelowFlatrate={allowBelowFlatrate}
        isAdjustmentEnabled={isAdjustmentEnabled}
        onToggleAdjustment={handleToggleAdjustment}
      />
    </div>
  );
};

export default LeaseAdjuster;
