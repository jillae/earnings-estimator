
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
  const handleSliderChange = (values: number[]) => {
    onAdjustmentChange(values[0]);
  };
  
  console.log("Leasing cost values:", { minLeaseCost, maxLeaseCost, leaseCost, adjustmentFactor });
  
  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '300ms' }}>
      <label className="input-label">
        Justera leasingkostnad
      </label>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-slate-500">Min: {formatCurrency(minLeaseCost)}</span>
        <span className="text-xs text-slate-500">Max: {formatCurrency(maxLeaseCost)}</span>
      </div>
      
      <Slider
        value={[adjustmentFactor]}
        min={0}
        max={1}
        step={0.01}
        onValueChange={handleSliderChange}
        className="my-4"
      />
      
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Leasingkostnad per månad (ex moms)</span>
        <span className="text-lg font-semibold text-slate-700">{formatCurrency(leaseCost)}</span>
      </div>
    </div>
  );
};

export default LeaseAdjuster;
