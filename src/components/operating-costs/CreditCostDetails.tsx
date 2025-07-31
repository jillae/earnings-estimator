
import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';
import CreditInfoPopover from '@/components/calculator/CreditInfoPopover';

interface CreditCostDetailsProps {
  useFlatrateOption: string;
  creditPrice: number;
  treatmentsPerDay: number;
  selectedMachine: {
    creditsPerTreatment?: number;
    flatrateAmount?: number;
  };
  flatrateAmount: number;
  creditsCostPerMonth: number;
  totalCreditsPerMonth: number;
}

const CreditCostDetails: React.FC<CreditCostDetailsProps> = ({
  useFlatrateOption,
  creditPrice,
  treatmentsPerDay,
  selectedMachine,
  flatrateAmount,
  creditsCostPerMonth,
  totalCreditsPerMonth
}) => {
  const calculateBreakEven = () => {
    if (!creditPrice || creditPrice <= 0) return 0;
    const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
    const breakEvenTreatmentsPerMonth = flatrateAmount / (creditPrice * creditsPerTreatment);
    return Math.ceil(breakEvenTreatmentsPerMonth / WORKING_DAYS_PER_MONTH);
  };

  return (
    <>
      {useFlatrateOption === 'perCredit' ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Pris per credit</span>
              <CreditInfoPopover />
            </div>
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
        </>
      ) : (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Flatrate kostnad per månad</span>
          <span className="text-lg font-semibold">{formatCurrency(flatrateAmount)}</span>
        </div>
      )}
      
      {flatrateAmount > 0 && useFlatrateOption === 'perCredit' && creditPrice > 0 && (
        <p className="text-xs text-blue-500 mt-2">
          Vid {calculateBreakEven()} eller fler behandlingar per dag kan flatrate vara mer kostnadseffektivt.
        </p>
      )}
    </>
  );
};

export default CreditCostDetails;
