
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Target, MoreHorizontal, Activity, Shield, Zap } from 'lucide-react';
import FlatrateIndicator from './FlatrateIndicator';
import { SliderStep } from '@/utils/sliderSteps';
import { useCalculator } from '@/context/CalculatorContext';

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
  const { logSignificantInteraction } = useCalculator();

  // Hantera slider förändring
  const handleSliderChange = (values: number[]) => {
    // Säkerställ att värdet är ett giltigt steg (0, 0.5, 1, 1.5, 2)
    const newStep = values[0] as SliderStep;
    console.log(`Slider ändrades till steg: ${newStep}`);
    
    // Logga signifikant interaktion för gated access
    logSignificantInteraction('slider_adjusted');
    
    onStepChange(newStep);
  };
  
  // Visa endast i grundleasing-läge
  if (!isGrundleasingMode) {
    return null;
  }

  // Ikon-komponenter för olika investeringsnivåer
  const getStepIcon = (step: SliderStep, isActive: boolean = false) => {
    const iconSize = 18;
    const activeClass = isActive ? "text-primary" : "text-slate-400";
    
    switch (step) {
      case 0:
        return <Target size={iconSize} className={`${activeClass} fill-none`} />; // Målsymbol - högsta creditkostnad
      case 0.5:
        return <MoreHorizontal size={iconSize} className={activeClass} />; // Partiell kompensation
      case 1:
        return <Activity size={iconSize} className={activeClass} />; // Balans/Standard
      case 1.5:
        return <Shield size={iconSize} className={activeClass} />; // Mer säkerhet/kompensation
      case 2:
        return <Zap size={iconSize} className={`${activeClass} fill-current`} />; // Full optimering - lägsta creditkostnad
      default:
        return <Activity size={iconSize} className={activeClass} />;
    }
  };

  // Funktion för att hantera klick på slider-steg
  const handleStepClick = (step: SliderStep) => {
    console.log(`Slider-steg klickat: ${step}`);
    
    // Logga signifikant interaktion för gated access
    logSignificantInteraction('slider_adjusted');
    
    onStepChange(step);
  };

  return (
    <div className="mb-4">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
          <span className="w-2 h-2 bg-red-400 rounded-sm mr-2"></span>
          Flexibel investering
        </h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          Balansera din investeringskostnad och driftkostnad för optimal lönsamhet
        </p>
      </div>

      {showSlider && (
        <div className="slider-container relative bg-red-50/20 border-red-200 p-6 rounded-xl border shadow-sm hover:bg-red-50/30 transition-colors">
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
          
          {/* Klickbara ikoner för varje steg */}
          <div className="flex justify-between items-center mt-4 px-1">
            <div 
              className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStepClick(0)}
            >
              {getStepIcon(0, currentStep === 0)}
              <span className="text-xs text-red-600 text-center">
                Låg investering
              </span>
            </div>
            <div 
              className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStepClick(0.5)}
            >
              {getStepIcon(0.5, currentStep === 0.5)}
              <span className="text-xs text-red-600 text-center">Flexibilitet</span>
            </div>
            <div 
              className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStepClick(1)}
            >
              {getStepIcon(1, currentStep === 1)}
              <span className="text-xs font-semibold text-red-700 text-center">Standard</span>
            </div>
            <div 
              className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStepClick(1.5)}
            >
              {getStepIcon(1.5, currentStep === 1.5)}
              <span className="text-xs text-red-600 text-center">Trygghet</span>
            </div>
            <div 
              className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStepClick(2)}
            >
              {getStepIcon(2, currentStep === 2)}
              <span className="text-xs text-red-600 text-center">
                Låg driftkostnad
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaseSlider;
