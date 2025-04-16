
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { useFlatrateHandler } from '@/hooks/useFlatrateHandler';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';
import { AlertTriangle } from 'lucide-react';

const OperatingCosts: React.FC = () => {
  const { 
    selectedMachine, 
    useFlatrateOption, 
    treatmentsPerDay, 
    creditPrice,
    leasingCost,
    flatrateThreshold,
    paymentOption,
    selectedSlaLevel,
    operatingCost
  } = useCalculator();

  const { handleFlatrateChange, canEnableFlatrate } = useFlatrateHandler();

  // Om ingen maskin är vald, visa inget
  if (!selectedMachine) {
    return null;
  }
  
  console.log(`OperatingCosts Rendering:
    Machine: ${selectedMachine.name}
    SLA Level: ${selectedSlaLevel}
    Credit Price: ${creditPrice}
    Uses Credits: ${selectedMachine.usesCredits}
    Flatrate Option: ${useFlatrateOption}
    Can Enable Flatrate: ${canEnableFlatrate}
  `);

  // För maskiner utan credits eller med Silver/Guld SLA visar vi förenklade kostnader
  if (!selectedMachine.usesCredits || selectedSlaLevel !== 'Brons') {
    const includesFlatrate = selectedMachine.usesCredits && selectedSlaLevel !== 'Brons';
    
    return (
      <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
        <h3 className="text-lg font-semibold mb-4">Driftskostnader</h3>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">
            Serviceavtal ({selectedSlaLevel})
            {includesFlatrate && ' inkl. Flatrate Credits'}
          </span>
          <span className="text-lg font-semibold text-blue-600">
            {formatCurrency(operatingCost.totalCost)}
          </span>
        </div>
        
        {includesFlatrate && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700">
              Obegränsat antal credits ingår i detta SLA-abonnemang.
            </p>
          </div>
        )}
      </div>
    );
  }

  // För maskiner med credits och Brons SLA, visa detaljerad vy med kreditpris/flatrate
  const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
  const totalCreditsPerMonth = treatmentsPerMonth * creditsPerTreatment;
  const creditsCostPerMonth = totalCreditsPerMonth * (creditPrice || 0);
  const flatrateAmount = selectedMachine.flatrateAmount || 0;

  // Beräkna vid vilken punkt flatrate blir mer kostnadseffektivt
  const calculateBreakEven = () => {
    if (!creditPrice || creditPrice <= 0) return 0;
    const breakEvenTreatmentsPerMonth = flatrateAmount / (creditPrice * creditsPerTreatment);
    return Math.ceil(breakEvenTreatmentsPerMonth / WORKING_DAYS_PER_MONTH);
  };

  // Visa recommendation baserat på leasingkostnad och flatrate-tröskelvärde
  const showFlatrateRecommendation = flatrateThreshold && 
    (paymentOption === 'cash' || (paymentOption === 'leasing' && leasingCost >= flatrateThreshold));

  return (
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold mb-4">Driftskostnader</h3>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="flatrate-switch"
            checked={useFlatrateOption === 'flatrate'}
            onCheckedChange={handleFlatrateChange}
            disabled={!canEnableFlatrate}
          />
          <Label htmlFor="flatrate-switch" className="text-sm font-medium">
            Använd Flatrate
          </Label>
        </div>
        <span className="text-sm text-gray-500">
          {useFlatrateOption === 'flatrate' ? 'Flatrate' : 'Per Credit'}
        </span>
      </div>

      {!canEnableFlatrate && useFlatrateOption !== 'flatrate' && (
        <div className="flex items-center gap-2 p-2 mb-4 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>
            {treatmentsPerDay < 3 
              ? "Minst 3 behandlingar per dag krävs för Flatrate" 
              : "Leasingkostnaden behöver ökas för att aktivera Flatrate"}
          </span>
        </div>
      )}

      {useFlatrateOption === 'perCredit' ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Pris per credit</span>
            <span className="text-lg font-semibold">{formatCurrency(creditPrice || 0)}</span>
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
      
      <div className="flex justify-between items-center mb-2 pt-2 mt-2 border-t border-gray-200">
        <span className="text-sm">Serviceavtal ({selectedSlaLevel})</span>
        <span className="text-lg font-semibold">{formatCurrency(operatingCost.slaCost)}</span>
      </div>
      
      <div className="flex justify-between items-center mb-2 pt-2 border-t border-gray-200">
        <span className="text-sm font-semibold">Total driftskostnad per månad</span>
        <span className="text-lg font-semibold text-blue-600">{formatCurrency(operatingCost.totalCost)}</span>
      </div>

      {flatrateAmount > 0 && useFlatrateOption === 'perCredit' && creditPrice > 0 && (
        <p className="text-xs text-blue-500 mt-2">
          Vid {calculateBreakEven()} eller fler behandlingar per dag kan flatrate vara mer kostnadseffektivt.
        </p>
      )}
      
      {showFlatrateRecommendation && useFlatrateOption !== 'flatrate' && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-700">
            {paymentOption === 'cash' 
              ? 'Vid kontantköp rekommenderar vi flatrate för obegränsad användning av credits.'
              : 'Baserat på din leasingkostnad rekommenderar vi att du använder flatrate för obegränsad användning av credits.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default OperatingCosts;
