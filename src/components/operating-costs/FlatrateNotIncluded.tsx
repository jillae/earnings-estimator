
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';

interface FlatrateNotIncludedProps {
  selectedDriftpaket: string;
  operatingCost: {
    slaCost: number;
    totalCost: number;
  };
  treatmentsPerDay: number;
  creditPrice: number;
  selectedMachine: {
    creditsPerTreatment?: number;
  };
}

const FlatrateNotIncluded: React.FC<FlatrateNotIncludedProps> = ({ 
  selectedDriftpaket, 
  operatingCost,
  treatmentsPerDay,
  creditPrice,
  selectedMachine
}) => {
  const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
  const totalCreditsPerMonth = treatmentsPerMonth * creditsPerTreatment;
  const creditsCostPerMonth = totalCreditsPerMonth * (creditPrice || 0);
  
  return (
    <>
      <div className="p-4 mb-4 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <p className="text-amber-700 font-medium">
            OBS! Flatrate ingår ej i {selectedDriftpaket}-paketet vid denna leasingnivå
          </p>
        </div>
        <p className="text-sm text-amber-600 pl-7">
          För att inkludera Flatrate (obegränsad användning) behöver du välja leasingpaket Standard eller högre.
          Styckepris för credits tillkommer därför nu utöver paketpriset.
        </p>
      </div>

      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">Pris per credit</span>
        <span className="text-lg font-semibold">{formatCurrency(creditPrice || 0, false)}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">Credits per månad</span>
        <span className="text-sm text-gray-600">{totalCreditsPerMonth} credits</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">Credit-kostnad per månad</span>
        <span className="text-lg font-semibold">{formatCurrency(creditsCostPerMonth)}</span>
      </div>
      
      {selectedDriftpaket === 'Guld' && operatingCost.slaCost > 0 && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Extra SLA-kostnad för Guld-paket</span>
          <span className="text-lg font-semibold">{formatCurrency(operatingCost.slaCost)}</span>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-2 pt-2 border-t border-gray-200">
        <span className="text-sm font-semibold">Total driftskostnad per månad</span>
        <span className="text-lg font-semibold text-blue-600">{formatCurrency(operatingCost.totalCost)}</span>
      </div>
    </>
  );
};

export default FlatrateNotIncluded;
