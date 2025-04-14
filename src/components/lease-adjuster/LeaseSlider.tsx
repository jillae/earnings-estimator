
import React, { useState, useEffect } from 'react';
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
  // State för att hantera faktiskt sliderposition
  const [sliderValue, setSliderValue] = useState(adjustmentFactor);
  
  // Uppdatera den interna sliderpositionen när props ändras
  useEffect(() => {
    setSliderValue(adjustmentFactor);
  }, [adjustmentFactor]);
  
  // Hantera slider förändring
  const handleInternalSliderChange = (values: number[]) => {
    // Uppdatera den interna sliderpositionen för direkt feedback
    setSliderValue(values[0]);
    
    // Skicka värdet uppåt i komponenthierarkin
    // Om allowBelowFlatrate är true låter vi slidern gå överallt
    // Om inte, kontrollerar vi om vi hamnar under tröskeln
    let newValues = [...values];
    
    if (!allowBelowFlatrate && thresholdPosition !== null && newValues[0] < thresholdPosition) {
      console.log(`Blockerar sliderförflyttning under ${thresholdPosition}% eftersom allowBelowFlatrate är ${allowBelowFlatrate}`);
      newValues[0] = thresholdPosition;
      setSliderValue(thresholdPosition);
    } else {
      console.log(`Slider förflyttning tillåten: ${newValues[0]}% (${allowBelowFlatrate ? 'utan restriktion' : 'med restriktion vid ' + thresholdPosition + '%'})`);
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
