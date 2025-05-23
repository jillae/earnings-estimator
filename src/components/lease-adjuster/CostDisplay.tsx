
import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';

interface CostDisplayProps {
  minLeaseCost: number;
  maxLeaseCost: number;
  leaseCost: number;
  showMinMax: boolean;
}

const CostDisplay: React.FC<CostDisplayProps> = ({ minLeaseCost, maxLeaseCost, leaseCost, showMinMax }) => {
  // Validera värden och säkerställ att de är 0 om de är ogiltiga
  const safeMinCost = isNaN(minLeaseCost) || minLeaseCost < 0 ? 0 : minLeaseCost;
  const safeMaxCost = isNaN(maxLeaseCost) || maxLeaseCost < 0 ? 0 : maxLeaseCost;
  const safeLeaseCost = isNaN(leaseCost) || leaseCost < 0 ? 0 : leaseCost;
  
  return (
    <div className="flex justify-between items-center mt-1 mb-4">
      {showMinMax ? (
        <>
          <span className="text-xs text-slate-600">Min: {formatCurrency(safeMinCost)}</span>
          <span className="text-md font-semibold text-slate-700">{formatCurrency(safeLeaseCost)}/månad</span>
          <span className="text-xs text-slate-600">Max: {formatCurrency(safeMaxCost)}</span>
        </>
      ) : (
        <span className="text-md font-semibold text-slate-700 w-full text-center">
          {formatCurrency(safeLeaseCost)}/månad
        </span>
      )}
    </div>
  );
};

export default CostDisplay;
