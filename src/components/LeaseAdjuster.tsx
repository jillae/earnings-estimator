
import React, { useMemo } from 'react';
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from '@/utils/calculatorUtils';

interface LeaseAdjusterProps {
  minLeaseCost: number;
  maxLeaseCost: number;
  leaseCost: number;
  adjustmentFactor: number;
  onAdjustmentChange: (value: number) => void;
}

const LeaseAdjuster: React.FC<LeaseAdjusterProps> = ({
  minLeaseCost,
  maxLeaseCost,
  leaseCost,
  adjustmentFactor,
  onAdjustmentChange
}) => {
  // Konvertera minLeaseCost och maxLeaseCost till närmaste 500-tal
  const roundedMinCost = Math.round(minLeaseCost / 500) * 500;
  const roundedMaxCost = Math.round(maxLeaseCost / 500) * 500;
  
  // Beräkna antalet steg om 500 kr mellan min och max
  const numSteps = (roundedMaxCost - roundedMinCost) / 500;
  
  // Beräkna vilket steg det nuvarande leaseCost motsvarar
  const currentCostStep = Math.round((leaseCost - roundedMinCost) / 500);
  const currentStepFactor = numSteps > 0 ? currentCostStep / numSteps : 0;
  
  // Funktion för att konvertera adjustmentFactor till närmaste steg
  const getStepValue = (factor: number): number => {
    if (numSteps <= 0) return factor;
    
    // Beräkna vilket steg som är närmast adjustmentFactor
    const step = Math.round(factor * numSteps);
    return step / numSteps;
  };
  
  const handleSliderChange = (values: number[]) => {
    // Konvertera värdet till närmaste steg
    const steppedValue = getStepValue(values[0]);
    onAdjustmentChange(steppedValue);
  };
  
  // Beräkna det faktiska leasing-kostnadsvärdet baserat på slider-position
  const actualLeasingCost = roundedMinCost + Math.round(adjustmentFactor * numSteps) * 500;
  
  // Visa formaterat kostnadsvärde
  const formattedCost = formatCurrency(actualLeasingCost);
  
  console.log("Leasing cost values:", { 
    minLeaseCost, 
    maxLeaseCost, 
    leaseCost,
    actualLeasingCost,
    roundedMinCost, 
    roundedMaxCost,
    numSteps,
    currentStepFactor,
    adjustmentFactor
  });
  
  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '300ms' }}>
      <label className="input-label">
        Justera leasingkostnad
      </label>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-slate-500">Min: {formatCurrency(roundedMinCost)}</span>
        <span className="text-xs text-slate-500">Max: {formatCurrency(roundedMaxCost)}</span>
      </div>
      
      <Slider
        value={[adjustmentFactor]}
        min={0}
        max={1}
        step={numSteps > 0 ? 1 / numSteps : 0.01}
        onValueChange={handleSliderChange}
        className="my-4"
      />
      
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Leasingkostnad per månad (ex moms)</span>
        <span className="text-lg font-semibold text-slate-700">{formattedCost}</span>
      </div>
    </div>
  );
};

export default LeaseAdjuster;
