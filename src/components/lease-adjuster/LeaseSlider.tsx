
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
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-slate-900 mb-2">
          Anpassa din investering
        </h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          Balansera din investeringskostnad med din driftkostnad för optimal lönsamhet
        </p>
      </div>

      
      {showSlider && (
        <div className="slider-container relative bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
            onValueChange={handleSliderChange}
            className="mt-6 slider-refined"
          />
          
          <div className="flex justify-between text-xs text-slate-500 mt-3 px-1">
            <span className="font-medium">Högsta credit-pris</span>
            <span className="font-medium">Mindre kompensation</span>
            <span className="font-semibold text-slate-700">Standard</span>
            <span className="font-medium">Mer kompensation</span>
            <span className="font-medium">Lägsta credit-pris</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaseSlider;
