
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
  // Log the actual values we're working with
  console.log("LeaseAdjuster rendering with:", {
    minLeaseCost,
    maxLeaseCost,
    leaseCost,
    adjustmentFactor
  });
  
  // Use exact min/max values without rounding
  const exactMinCost = minLeaseCost;
  const exactMaxCost = maxLeaseCost;
  
  // Calculate number of steps between min and max for slider precision
  const stepSize = 100; // 100kr steps for finer control
  const numSteps = Math.max(1, Math.floor((exactMaxCost - exactMinCost) / stepSize));
  
  // Function to convert adjustmentFactor to a clean step value
  const getStepValue = (factor: number): number => {
    if (numSteps <= 0) return factor;
    
    // Calculate which step is closest to the adjustmentFactor
    const step = Math.round(factor * numSteps);
    return step / numSteps;
  };
  
  const handleSliderChange = (values: number[]) => {
    // Convert value to nearest step
    const steppedValue = getStepValue(values[0]);
    onAdjustmentChange(steppedValue);
  };
  
  // Calculate actual leasing cost based on slider position
  const actualLeasingCost = leaseCost; // Use the value that was calculated
  
  // Format cost values for display - show exact values without rounding
  const formattedMinCost = formatCurrency(exactMinCost, false);
  const formattedMaxCost = formatCurrency(exactMaxCost, false);
  const formattedCost = formatCurrency(actualLeasingCost, false);
  
  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '300ms' }}>
      <label className="input-label">
        Justera leasingkostnad
      </label>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-slate-500">Min: {formattedMinCost}</span>
        <span className="text-xs text-slate-500">Max: {formattedMaxCost}</span>
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
