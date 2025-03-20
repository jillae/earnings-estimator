
import React from 'react';
import { formatCurrency } from '@/utils/calculatorUtils';

interface CostDisplayProps {
  minLeaseCost: number;
  maxLeaseCost: number;
  leaseCost: number;
}

const CostDisplay: React.FC<CostDisplayProps> = ({ minLeaseCost, maxLeaseCost, leaseCost }) => {
  return (
    <div className="flex justify-between items-center mt-1 mb-4">
      <span className="text-xs text-slate-600">Min: {formatCurrency(minLeaseCost, false, true)}</span>
      <span className="text-md font-semibold text-slate-700">{formatCurrency(leaseCost, false, true)}/månad</span>
      <span className="text-xs text-slate-600">Max: {formatCurrency(maxLeaseCost, false, true)}</span>
    </div>
  );
};

export default CostDisplay;
