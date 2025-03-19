
import React from 'react';
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
  console.log("LeaseAdjuster rendering with:", {
    minLeaseCost,
    maxLeaseCost,
    leaseCost,
    adjustmentFactor
  });

  // Use exact min and max costs directly from props without modification
  const exactMinCost = minLeaseCost;
  const exactMaxCost = maxLeaseCost;

  // Calculate the step size for the slider based on 500 SEK
  const stepSizeSek = 500;
  const costRange = exactMaxCost - exactMinCost;
  const sliderStep = costRange > 0 ? stepSizeSek / costRange : 0.01; // Fallback if range is zero

  const handleSliderChange = (values: number[]) => {
    onAdjustmentChange(values[0]);
  };

  const actualLeasingCost = leaseCost;

  // Use formatted values without rounding for display consistency
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
        step={sliderStep}
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
