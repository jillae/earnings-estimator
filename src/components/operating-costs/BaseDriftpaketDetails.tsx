
import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';
import FlatrateToggle from './FlatrateToggle';
import FlatrateTooltip from '../lease-adjuster/FlatrateTooltip';
import CreditCostDetails from './CreditCostDetails';

interface BaseDriftpaketDetailsProps {
  useFlatrateOption: string;
  handleFlatrateChange: (checked: boolean) => void;
  canEnableFlatrate: boolean;
  paymentOption: string;
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
  handleFlatrateChange,
  canEnableFlatrate,
  paymentOption,
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
      <div className="flex items-center justify-between mb-3">
        <FlatrateToggle 
          useFlatrateOption={useFlatrateOption} 
          handleFlatrateChange={handleFlatrateChange} 
          canEnableFlatrate={canEnableFlatrate} 
          paymentOption={paymentOption}
          selectedDriftpaket={selectedDriftpaket}
        />
        <FlatrateTooltip />
      </div>

      <CreditCostDetails 
        useFlatrateOption={useFlatrateOption}
        creditPrice={creditPrice}
        treatmentsPerDay={treatmentsPerDay}
        selectedMachine={selectedMachine}
        flatrateAmount={flatrateAmount}
        creditsCostPerMonth={creditsCostPerMonth}
        totalCreditsPerMonth={totalCreditsPerMonth}
      />
      
      <div className="flex justify-between items-center mb-2 pt-2 border-t border-gray-200">
        <span className="text-sm font-semibold">Total driftskostnad per månad</span>
        <span className="text-lg font-semibold text-blue-600">{formatCurrency(operatingCost.totalCost)}</span>
      </div>
    </>
  );
};

export default BaseDriftpaketDetails;
