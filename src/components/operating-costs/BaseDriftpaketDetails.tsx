
import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';
import CreditCostDetails from './CreditCostDetails';

interface BaseDriftpaketDetailsProps {
  useFlatrateOption: string;
  creditPrice: number;
  treatmentsPerDay: number;
  selectedMachine: {
    creditsPerTreatment?: number;
    flatrateAmount?: number;
  };
  operatingCost: {
    totalCost: number;
  };
  selectedDriftpaket?: string;
}

const BaseDriftpaketDetails: React.FC<BaseDriftpaketDetailsProps> = ({
  useFlatrateOption,
  creditPrice,
  treatmentsPerDay,
  selectedMachine,
  operatingCost,
  selectedDriftpaket = 'Bas'
}) => {
  const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
  const totalCreditsPerMonth = treatmentsPerMonth * creditsPerTreatment;
  const creditsCostPerMonth = totalCreditsPerMonth * (creditPrice || 0);
  const flatrateAmount = selectedMachine.flatrateAmount || 0;

  return (
    <>
      <CreditCostDetails
        useFlatrateOption={useFlatrateOption}
        creditPrice={creditPrice}
        treatmentsPerDay={treatmentsPerDay}
        selectedMachine={selectedMachine}
        flatrateAmount={flatrateAmount}
        creditsCostPerMonth={creditsCostPerMonth}
        totalCreditsPerMonth={totalCreditsPerMonth}
      />
      
      {/* Förtydliga vad som ingår */}
      {(selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') && useFlatrateOption === 'flatrate' && (
        <div className="text-xs text-green-700 bg-green-50 p-2 rounded mb-3">
          ✓ Credits ingår i {selectedDriftpaket}-paketet och debiteras inte separat
        </div>
      )}
      
      <div className="flex justify-between items-center mb-2 pt-2 border-t border-gray-200">
        <span className="text-sm font-semibold">
          {(selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') && useFlatrateOption === 'flatrate' 
            ? 'Total fast driftskostnad per månad' 
            : 'Total driftskostnad per månad'
          }
        </span>
        <span className="text-lg font-semibold text-blue-600">{formatCurrency(operatingCost.totalCost)}</span>
      </div>
    </>
  );
};

export default BaseDriftpaketDetails;
