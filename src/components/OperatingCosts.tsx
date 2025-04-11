
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCalculator } from '@/context/calculator/context';
import { formatCurrency } from '@/utils/formatUtils';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';

const OperatingCosts: React.FC = () => {
  const { 
    selectedMachine, 
    useFlatrateOption, 
    setUseFlatrateOption, 
    treatmentsPerDay, 
    creditPrice
  } = useCalculator();

  // Om ingen maskin är vald eller maskinen inte använder krediter, visa inget
  if (!selectedMachine || !selectedMachine.usesCredits) {
    return null;
  }

  // Beräkna kostnader utifrån credits eller flatrate
  const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
  const creditsCostPerMonth = treatmentsPerMonth * creditsPerTreatment * (creditPrice || 0);
  const flatrateAmount = selectedMachine.flatrateAmount || 0;

  // Hantera flatrate-switch
  const handleFlatrateChange = (checked: boolean) => {
    setUseFlatrateOption(checked ? 'flatrate' : 'perCredit');
  };

  // Beräkna vid vilken punkt flatrate blir mer kostnadseffektivt
  const calculateBreakEven = () => {
    if (!creditPrice || creditPrice <= 0) return 0;
    const breakEvenTreatmentsPerMonth = flatrateAmount / (creditPrice * creditsPerTreatment);
    return Math.ceil(breakEvenTreatmentsPerMonth / WORKING_DAYS_PER_MONTH);
  };

  return (
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold mb-4">Driftskostnader - Credits</h3>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="flatrate-switch"
            checked={useFlatrateOption === 'flatrate'}
            onCheckedChange={handleFlatrateChange}
          />
          <Label htmlFor="flatrate-switch" className="text-sm font-medium">
            Använd Flatrate
          </Label>
        </div>
        <span className="text-sm text-gray-500">
          {useFlatrateOption === 'flatrate' ? 'Flatrate' : 'Per Credit'}
        </span>
      </div>

      {useFlatrateOption === 'perCredit' ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Pris per credit</span>
            <span className="text-lg font-semibold">{formatCurrency(creditPrice || 0)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Credits per behandling</span>
            <span className="text-lg font-semibold">{creditsPerTreatment}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Kostnad per månad</span>
            <span className="text-lg font-semibold text-blue-600">{formatCurrency(creditsCostPerMonth)}</span>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Flatrate kostnad per månad</span>
          <span className="text-lg font-semibold text-blue-600">{formatCurrency(flatrateAmount)}</span>
        </div>
      )}

      {flatrateAmount > 0 && useFlatrateOption === 'perCredit' && (
        <p className="text-xs text-blue-500 mt-2">
          Vid {calculateBreakEven()} eller fler behandlingar per dag kan flatrate vara mer kostnadseffektivt.
        </p>
      )}
    </div>
  );
};

export default OperatingCosts;
