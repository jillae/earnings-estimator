
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
  showSlider: boolean;
  isGrundleasingMode: boolean; // Ny prop för att styra om vi är i grundleasing-läge
}

const LeaseSlider: React.FC<LeaseSliderProps> = ({
  currentStep,
  onStepChange,
  thresholdPosition,
  showFlatrateIndicator,
  allowBelowFlatrate,
  isAdjustmentEnabled,
  onToggleAdjustment,
  showAdjustmentCheckbox,
  showSlider,
  isGrundleasingMode
}) => {
  // Hantera slider förändring
  const handleSliderChange = (values: number[]) => {
    // Säkerställ att värdet är ett giltigt steg (0, 0.5, 1, 1.5, 2)
    const newStep = values[0] as SliderStep;
    console.log(`Slider ändrades till steg: ${newStep}`);
    onStepChange(newStep);
  };
  
  // Visa endast i grundleasing-läge
  if (!isGrundleasingMode) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="mb-3">
        <h4 className="text-sm font-medium text-slate-900 mb-1">
          Finjustera grundleasingkostnad
        </h4>
        <p className="text-xs text-slate-600">
          Justera din månatliga leasingkostnad inom ett snävt intervall (±10%)
        </p>
      </div>

      {showAdjustmentCheckbox && (
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="adjustmentEnabled" 
            checked={isAdjustmentEnabled}
            onCheckedChange={onToggleAdjustment}
          />
          <Label htmlFor="adjustmentEnabled" className="text-sm text-slate-600">
            Aktivera finjustering av grundleasingkostnad
          </Label>
        </div>
      )}
      
      {showSlider && (
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
            <span>-10%</span>
            <span>-5%</span>
            <span>Standard</span>
            <span>+5%</span>
            <span>+10%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaseSlider;
