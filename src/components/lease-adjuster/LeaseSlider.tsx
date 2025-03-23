
import React from 'react';
import { Slider } from "@/components/ui/slider";
import FlatrateIndicator from './FlatrateIndicator';

interface LeaseSliderProps {
  adjustmentFactor: number; // Nu som procentvärde (0-100)
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
  // Vi använder alltid procent (0-100) istället för faktor (0-1)
  // Vi tillämpar begränsning baserat på tillåtelseinställningar och tröskelvärde
  const handleSliderChange = (values: number[]) => {
    let newValues = [...values];
    
    // Begränsa slidern från att gå under thresholdPosition om allowBelowFlatrate är false
    // och vi har ett giltigt thresholdPosition
    if (!allowBelowFlatrate && thresholdPosition !== null && newValues[0] < thresholdPosition) {
      newValues[0] = thresholdPosition;
    }
    
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
        step={1} // Använd heltal för procentvärden
        onValueChange={handleSliderChange}
        className="mt-8"
      />
    </div>
  );
};

export default LeaseSlider;
