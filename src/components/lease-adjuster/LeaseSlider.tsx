
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";

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
  const [sliderValue, setSliderValue] = useState(adjustmentFactor);
  
  useEffect(() => {
    setSliderValue(adjustmentFactor);
  }, [adjustmentFactor]);
  
  const handleInternalSliderChange = (values: number[]) => {
    setSliderValue(values[0]);
    onSliderChange(values);
  };
  
  return (
    <div className="slider-container relative mb-6">
      <Slider
        id="leasingCostSlider"
        value={[sliderValue]}
        min={0}
        max={100}
        step={1}
        onValueChange={handleInternalSliderChange}
        className="mt-8"
      />
    </div>
  );
};

export default LeaseSlider;
