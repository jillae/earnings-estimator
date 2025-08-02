
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
      case 1:
        return <MoreHorizontal size={iconSize} className={activeClass} />; // Låg nivå
      case 2:
        return <Activity size={iconSize} className={activeClass} />; // Balans/Standard
      case 3:
        return <Shield size={iconSize} className={activeClass} />; // Hög nivå
      case 4:
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
      {/* Ingen extra rubrik här - redan täckt av LeaseAdjuster */}
      
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
            max={4}
            step={1}
            onValueChange={handleSliderChange}
            className="mt-6 slider-refined touch-manipulation"
            style={{
              touchAction: 'manipulation',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none'
            }}
          />
          
          {/* Klickbara ikoner för varje steg - större träffytor */}
          <div className="grid grid-cols-5 gap-0 mt-4">
            <div 
              className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity touch-manipulation p-4 -m-4 min-h-[60px] min-w-[60px] flex items-center justify-center rounded-lg hover:bg-slate-100"
              onClick={() => handleStepClick(0)}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleStepClick(0);
              }}
            >
              {getStepIcon(0, currentStep === 0)}
              <span className="text-xs text-slate-500 text-center leading-tight">
                Låg<br/>investering
              </span>
            </div>
            <div 
              className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity touch-manipulation p-4 -m-4 min-h-[60px] min-w-[60px] flex items-center justify-center rounded-lg hover:bg-slate-100"
              onClick={() => handleStepClick(1)}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleStepClick(1);
              }}
            >
              {getStepIcon(1, currentStep === 1)}
              <span className="text-xs text-slate-500 text-center leading-tight">Flexibilitet</span>
            </div>
            <div 
              className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity touch-manipulation p-4 -m-4 min-h-[60px] min-w-[60px] flex items-center justify-center rounded-lg hover:bg-slate-100"
              onClick={() => handleStepClick(2)}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleStepClick(2);
              }}
            >
              {getStepIcon(2, currentStep === 2)}
              <span className="text-xs font-semibold text-slate-700 text-center leading-tight">Standard</span>
            </div>
            <div 
              className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity touch-manipulation p-4 -m-4 min-h-[60px] min-w-[60px] flex items-center justify-center rounded-lg hover:bg-slate-100"
              onClick={() => handleStepClick(3)}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleStepClick(3);
              }}
            >
              {getStepIcon(3, currentStep === 3)}
              <span className="text-xs text-slate-500 text-center leading-tight">Trygghet</span>
            </div>
            <div 
              className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity touch-manipulation p-4 -m-4 min-h-[60px] min-w-[60px] flex items-center justify-center rounded-lg hover:bg-slate-100"
              onClick={() => handleStepClick(4)}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleStepClick(4);
              }}
            >
              {getStepIcon(4, currentStep === 4)}
              <span className="text-xs text-slate-500 text-center leading-tight">
                Låg<br/>driftkostnad
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaseSlider;
