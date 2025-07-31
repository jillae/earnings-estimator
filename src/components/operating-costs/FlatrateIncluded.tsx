
import React from 'react';
import { Info } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';

interface FlatrateIncludedProps {
  selectedDriftpaket: string;
  operatingCost: {
    slaCost: number;
    totalCost: number;
  };
}

const FlatrateIncluded: React.FC<FlatrateIncludedProps> = ({ 
  selectedDriftpaket, 
  operatingCost 
}) => {
  return (
    <>
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-5 w-5 text-blue-600" />
          <p className="text-blue-700 font-medium">
            Credits ingår i ditt valda {selectedDriftpaket}-paket
          </p>
        </div>
        <p className="text-sm text-blue-600 pl-7">
          Obegränsad användning av credits utan extra kostnader.
        </p>
      </div>
      
      {selectedDriftpaket === 'Guld' && operatingCost.slaCost > 0 && (
        <div className="flex justify-between items-center mt-4 mb-2">
          <span className="text-sm">Extra SLA-kostnad för Guld-paket</span>
          <span className="text-lg font-semibold">{formatCurrency(operatingCost.slaCost, false, true)}</span>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-2 pt-2 border-t border-gray-200">
        <span className="text-sm font-semibold">Total driftskostnad per månad</span>
        <span className="text-lg font-semibold text-blue-600">{formatCurrency(operatingCost.totalCost)}</span>
      </div>
    </>
  );
};

export default FlatrateIncluded;
