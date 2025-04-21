
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
  
  // Säkra mina/max värden så att när det inte finns maskin, sätt till 0
  const exactMinCost = selectedMachine ? minLeaseCost : 0;
  const exactMaxCost = selectedMachine ? maxLeaseCost : 0;
  
  const defaultCost = stepValues[1]?.leasingCost || ( (exactMinCost + exactMaxCost) / 2);
  
  let flatratePosition = null;
  if (flatrateThreshold) {
    flatratePosition = ((flatrateThreshold - exactMinCost) / Math.max(0.001, exactMaxCost - exactMinCost)) * 100;
    flatratePosition = Math.max(0, Math.min(100, flatratePosition));
  }
  
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

  const currentStepLabel = stepValues[currentSliderStep]?.label || 'Standard';

  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '300ms' }}>
      <label className="input-label flex items-center justify-between gap-2">
        <span>Månadskostnad leasing</span>
        <span className="text-sm font-medium text-blue-600">{currentStepLabel}</span>
      </label>

      <CostDisplay 
        minLeaseCost={exactMinCost}
        maxLeaseCost={exactMaxCost}
        leaseCost={leaseCost}
      />

      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center text-sm bg-blue-50 p-2 rounded-md gap-1">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Rekommenderat pris: <span className="font-semibold">{formatCurrency(defaultCost)}</span></span>
        </div>
        
        {selectedMachine?.usesCredits && (
          <div className="flex items-center text-sm bg-green-50 p-2 rounded-md gap-1">
            <CreditCard className="w-4 h-4 text-green-600 shrink-0" />
            <span>Krediter per behandling: <span className="font-semibold">{formatCurrency(calculatedCreditPrice)} kr/credit</span></span>
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

