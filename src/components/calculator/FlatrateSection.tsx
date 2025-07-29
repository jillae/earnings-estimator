import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { useFlatrateHandler } from '@/hooks/useFlatrateHandler';
import FlatrateToggle from '../operating-costs/FlatrateToggle';
import FlatrateTooltip from '../lease-adjuster/FlatrateTooltip';
import { Info } from 'lucide-react';

const FlatrateSection: React.FC = () => {
  const {
    selectedMachine,
    paymentOption,
    selectedDriftpaket
  } = useCalculator();

  const { useFlatrateOption, handleFlatrateChange, canEnableFlatrate } = useFlatrateHandler();

  // Visa endast för maskiner som använder credits
  if (!selectedMachine?.usesCredits) {
    return null;
  }

  return (
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '350ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Flatrate-alternativ</h3>
        <FlatrateTooltip />
      </div>
      
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-slate-700">
            Välj hur du vill betala för credits - per behandling eller med fast månadsavgift.
          </p>
        </div>
      </div>

      <FlatrateToggle 
        useFlatrateOption={useFlatrateOption}
        handleFlatrateChange={handleFlatrateChange}
        canEnableFlatrate={canEnableFlatrate}
        paymentOption={paymentOption}
        selectedDriftpaket={selectedDriftpaket}
      />
      
      {useFlatrateOption === 'flatrate' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✓ Obegränsad användning av credits för en fast månadsavgift.
          </p>
        </div>
      )}
      
      {useFlatrateOption === 'perCredit' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            📊 Betala endast för de credits du faktiskt använder. Maximal flexibilitet.
          </p>
        </div>
      )}
    </div>
  );
};

export default FlatrateSection;