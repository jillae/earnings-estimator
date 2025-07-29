
import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';

interface NonCreditMachineDetailsProps {
  selectedDriftpaket: string;
  operatingCost: {
    slaCost: number;
    totalCost: number;
  };
}

const NonCreditMachineDetails: React.FC<NonCreditMachineDetailsProps> = ({ 
  selectedDriftpaket, 
  operatingCost 
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">SLA-kostnad för {selectedDriftpaket}-paket</span>
        <span className="text-lg font-semibold">{formatCurrency(operatingCost.slaCost, false, true)}</span>
      </div>
      
      <div className="flex justify-between items-center mb-2 pt-2 border-t border-gray-200">
        <span className="text-sm font-semibold">Total driftskostnad per månad</span>
        <span className="text-lg font-semibold text-blue-600">{formatCurrency(operatingCost.totalCost)}</span>
      </div>
    </>
  );
};

export default NonCreditMachineDetails;
