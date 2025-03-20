
import React from 'react';
import { Slider } from "@/components/ui/slider";
import FlatrateIndicator from './FlatrateIndicator';

interface LeaseSliderProps {
  adjustmentFactor: number;
  onSliderChange: (values: number[]) => void;
  thresholdPosition: number | null;
  showFlatrateIndicator: boolean;
  allowBelowFlatrate: boolean;
}

const LeaseSlider: React.FC<LeaseSliderProps> = ({
  adjustmentFactor,
  onSliderChange,
  thresholdPosition,
  showFlatrateIndicator,
  allowBelowFlatrate
}) => {
  // Ändrar från 500 SEK-steg till 100 SEK-steg
  // Vi använder fortfarande 0-1 för själva slidern, men i LeaseAdjuster kommer detta
  // översättas till faktiska kostnadssteg om 100 SEK
  const sliderStep = 0.005; // Mindre steg för att stödja 100 SEK ökningar

  return (
    <div className="slider-container relative mb-6">
      <FlatrateIndicator 
        thresholdPosition={thresholdPosition} 
        showFlatrateIndicator={showFlatrateIndicator}
        allowBelowFlatrate={allowBelowFlatrate}
      />
      
      <Slider
        id="leasingCostSlider"
        value={[adjustmentFactor]}
        min={0}
        max={1}
        step={sliderStep}
        onValueChange={onSliderChange}
        className="mt-8"
      />
    </div>
  );
};

export default LeaseSlider;
