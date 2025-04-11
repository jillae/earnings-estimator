
import React from 'react';
import { Slider } from "@/components/ui/slider";
import FlatrateIndicator from './FlatrateIndicator';

interface LeaseSliderProps {
  adjustmentFactor: number; // Som procentvärde (0-100)
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
  // Vi använder alltid procent (0-100)
  const handleSliderChange = (values: number[]) => {
    let newValues = [...values];
    
    // Begränsa slidern från att gå under thresholdPosition om allowBelowFlatrate är false
    if (!allowBelowFlatrate && thresholdPosition !== null && newValues[0] < thresholdPosition) {
      newValues[0] = thresholdPosition;
    }
    
    console.log(`Slider värde: ${newValues[0]}%, Begränsning: ${allowBelowFlatrate ? 'Av' : 'På'}, Tröskel: ${thresholdPosition}%`);
    
    onSliderChange(newValues);
  };
  
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
        max={100}
        step={1}
        onValueChange={handleSliderChange}
        className="mt-8"
      />
    </div>
  );
};

export default LeaseSlider;
