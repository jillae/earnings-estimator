
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
  // Ändrar från procentbaserat steg till 500 SEK-steg
  // Vi använder fortfarande 0-1 för själva slidern, men i LeaseAdjuster kommer detta
  // översättas till faktiska kostnadssteg om 500 SEK
  const sliderStep = 0.01; // Eftersom vi använder 0-1 range, blir detta cirka 1% av range

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
