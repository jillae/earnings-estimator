
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
  const sliderStep = 1 / 100; // 100 steg från min till max

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
