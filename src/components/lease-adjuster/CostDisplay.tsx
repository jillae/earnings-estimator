
import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';

interface CostDisplayProps {
  minLeaseCost: number;
  maxLeaseCost: number;
  leaseCost: number;
}

const CostDisplay: React.FC<CostDisplayProps> = ({ minLeaseCost, maxLeaseCost, leaseCost }) => {
  // Validera värden
  const safeMinCost = isNaN(minLeaseCost) ? 0 : minLeaseCost;
  const safeMaxCost = isNaN(maxLeaseCost) ? 0 : maxLeaseCost;
  const safeLeaseCost = isNaN(leaseCost) ? 0 : leaseCost;
  
  return (
    <div className="flex justify-between items-center mt-1 mb-4">
      <span className="text-xs text-slate-600">Min: {formatCurrency(safeMinCost, false, true)}</span>
      <span className="text-md font-semibold text-slate-700">{formatCurrency(safeLeaseCost, false, true)}/månad</span>
      <span className="text-xs text-slate-600">Max: {formatCurrency(safeMaxCost, false, true)}</span>
    </div>
  );
};

export default CostDisplay;
