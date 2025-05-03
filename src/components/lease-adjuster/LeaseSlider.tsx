
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FlatrateIndicator from './FlatrateIndicator';
import { SliderStep } from '@/utils/sliderSteps';

interface LeaseSliderProps {
  currentStep: SliderStep; 
  onStepChange: (step: SliderStep) => void;
  thresholdPosition: number | null;
  showFlatrateIndicator: boolean;
  allowBelowFlatrate: boolean;
  isAdjustmentEnabled: boolean;
  onToggleAdjustment: (enabled: boolean) => void;
  showAdjustmentCheckbox: boolean;
}

const LeaseSlider: React.FC<LeaseSliderProps> = ({
  currentStep,
  onStepChange,
  thresholdPosition,
  showFlatrateIndicator,
  allowBelowFlatrate,
  isAdjustmentEnabled,
  onToggleAdjustment,
  showAdjustmentCheckbox
}) => {
  // Hantera slider förändring
  const handleSliderChange = (values: number[]) => {
    // Säkerställ att värdet är ett giltigt steg (0, 0.5, 1, 1.5, 2)
    const newStep = values[0] as SliderStep;
    console.log(`Slider ändrades till steg: ${newStep}`);
    onStepChange(newStep);
  };
  
  return (
    <div className="mb-6">
      {showAdjustmentCheckbox && (
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="adjustmentEnabled" 
            checked={isAdjustmentEnabled}
            onCheckedChange={onToggleAdjustment}
          />
          <Label htmlFor="adjustmentEnabled" className="text-sm text-slate-600">
            Jag vill anpassa balansen mellan leasingkostnad och kreditpris
          </Label>
        </div>
      )}
      
      <div className="slider-container relative">
        <FlatrateIndicator 
          thresholdPosition={thresholdPosition} 
          showFlatrateIndicator={showFlatrateIndicator}
          allowBelowFlatrate={allowBelowFlatrate}
        />
        
        <Slider
          value={[currentStep]}
          min={0}
          max={2}
          step={0.5}
          disabled={!isAdjustmentEnabled}
          onValueChange={handleSliderChange}
          className="mt-8"
        />
        
        <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
          <span>Min</span>
          <span>Låg</span>
          <span>Standard</span>
          <span>Hög</span>
          <span>Max</span>
        </div>
      </div>
    </div>
  );
};

export default LeaseSlider;
