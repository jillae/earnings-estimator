
import React, { useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';

const OperatingCosts: React.FC = () => {
  const { 
    selectedMachine, 
    useFlatrateOption, 
    setUseFlatrateOption, 
    treatmentsPerDay, 
    creditPrice,
    leasingCost,
    leasingRange,
    flatrateThreshold,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor
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

  // Hantera flatrate-switch med automatisk justering av slider
  const handleFlatrateChange = (checked: boolean) => {
    // Först, ändra flatrate-alternativet
    setUseFlatrateOption(checked ? 'flatrate' : 'perCredit');
    
    // Om användaren aktiverar flatrate och är under tröskelvärdet, justera slidern automatiskt
    if (checked && flatrateThreshold && leasingCost < flatrateThreshold) {
      // Beräkna den nya justeringsfaktorn för att nå tröskelvärdet
      const thresholdFactor = leasingRange.max > leasingRange.min
        ? (flatrateThreshold - leasingRange.min) / (leasingRange.max - leasingRange.min)
        : 0.8; // Fallback till 80% om beräkningen misslyckas
      
      console.log(`Justerar slider automatiskt till flatrate-tröskelvärdet:
        Nuvarande leasingkostnad: ${leasingCost}
        Tröskelvärde: ${flatrateThreshold}
        Beräknad justeringsfaktor: ${thresholdFactor}
      `);
      
      // Uppdatera slidern till tröskelvärdet (minst 80%)
      setLeaseAdjustmentFactor(Math.max(0.8, thresholdFactor));
    }
  };

  // Beräkna vid vilken punkt flatrate blir mer kostnadseffektivt
  const calculateBreakEven = () => {
    if (!creditPrice || creditPrice <= 0) return 0;
    const breakEvenTreatmentsPerMonth = flatrateAmount / (creditPrice * creditsPerTreatment);
    return Math.ceil(breakEvenTreatmentsPerMonth / WORKING_DAYS_PER_MONTH);
  };

  // Visa recommendation baserat på leasingkostnad och flatrate-tröskelvärde
  const showFlatrateRecommendation = flatrateThreshold && leasingCost >= flatrateThreshold;

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
      
      {showFlatrateRecommendation && useFlatrateOption !== 'flatrate' && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-700">
            Baserat på din leasingkostnad rekommenderar vi att du använder flatrate. 
            Detta ger dig obegränsad användning av credits.
          </p>
        </div>
      )}
    </div>
  );
};

export default OperatingCosts;
