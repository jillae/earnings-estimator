
import React from 'react';
import { formatCurrency, roundToHundredEndingSix } from '@/utils/formatUtils';

interface CostDisplayProps {
  minLeaseCost: number;
  maxLeaseCost: number;
  leaseCost: number;
}

const CostDisplay: React.FC<CostDisplayProps> = ({
  minLeaseCost,
  maxLeaseCost,
  leaseCost
}) => {
  const formattedMinCost = formatCurrency(minLeaseCost, true);
  const formattedMaxCost = formatCurrency(maxLeaseCost, true);
  const formattedLeaseCost = formatCurrency(leaseCost, true);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-slate-500">Min: {formattedMinCost}</span>
        <span className="text-xs text-slate-500">Max: {formattedMaxCost}</span>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm font-medium">Leasingkostnad per månad (ex moms)</span>
        <span className="text-lg font-semibold text-slate-700">{formattedLeaseCost}</span>
      </div>
    </>
  );
};

export default CostDisplay;
