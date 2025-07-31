import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { useFlatrateHandler } from '@/hooks/useFlatrateHandler';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatUtils';
import { Info, CheckCircle2, XCircle } from 'lucide-react';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';
import FlatrateCard from './FlatrateCard';
import PerCreditCard from './PerCreditCard';

const FlatrateSection: React.FC = () => {
  const {
    selectedMachine,
    paymentOption,
    selectedDriftpaket,
    treatmentsPerDay,
    creditPrice,
    selectedSlaLevel,
    selectedLeasingModel
  } = useCalculator();

  const { useFlatrateOption, handleFlatrateChange, canEnableFlatrate } = useFlatrateHandler();

  // Visa endast för maskiner som använder credits OCH inte är i strategimodell-läge
  if (!selectedMachine?.usesCredits || selectedLeasingModel === 'strategimodell') {
    return null;
  }

  // Beräkna kostnader för jämförelse
  const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
  const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  const totalCreditsPerMonth = treatmentsPerMonth * creditsPerTreatment;
  const creditsCostPerMonth = totalCreditsPerMonth * (creditPrice || 0);
  
  // Beräkna Flatrate-kostnad med SLA-rabatt
  let flatrateCost = selectedMachine.flatrateAmount || 0;
  if (selectedSlaLevel === 'Silver') {
    flatrateCost = flatrateCost * 0.5; // 50% rabatt
  } else if (selectedSlaLevel === 'Guld') {
    flatrateCost = 0; // 100% rabatt (gratis)
  }

  const savings = creditsCostPerMonth - flatrateCost;
  const isFlatrateAdvantage = savings > 0;

  // Hämta rabattinformation
  const getFlatrateDiscount = () => {
    if (selectedSlaLevel === 'Silver') return 'Med SLA Silver: 50% rabatt';
    if (selectedSlaLevel === 'Guld') return 'Med SLA Guld: Gratis (100% rabatt)';
    return '';
  };

  // Handler för kort-val
  const handlePerCreditSelect = () => {
    handleFlatrateChange(false);
  };

  const handleFlatrateSelect = () => {
    handleFlatrateChange(true);
  };

  return (
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '350ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Betalningsmodell för Credits</h3>
        <Badge variant={useFlatrateOption === 'flatrate' ? 'default' : 'secondary'}>
          {useFlatrateOption === 'flatrate' ? 'Flatrate' : 'Per Credit'}
        </Badge>
      </div>
      
      {/* Kort-baserad val */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Per Credit Card */}
          <PerCreditCard
            isSelected={useFlatrateOption === 'perCredit'}
            onSelect={handlePerCreditSelect}
            creditPrice={creditPrice || 0}
            creditsPerTreatment={creditsPerTreatment}
            treatmentsPerDay={treatmentsPerDay}
            isDisabled={selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld'}
          />

          {/* Flatrate Card */}
          <FlatrateCard
            isSelected={useFlatrateOption === 'flatrate'}
            isEnabled={canEnableFlatrate}
            onSelect={handleFlatrateSelect}
            flatrateCost={flatrateCost}
            discountText={getFlatrateDiscount()}
            selectedSlaLevel={selectedSlaLevel}
          />
        </div>

        {/* Besparingsindikator */}
        {treatmentsPerDay > 0 && (
          <div className={`p-3 rounded-lg ${isFlatrateAdvantage ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
            <div className="flex items-center gap-2">
              {isFlatrateAdvantage ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-orange-600" />
              )}
              <div className="text-sm">
                <span className={isFlatrateAdvantage ? 'text-green-700' : 'text-orange-700'}>
                  {isFlatrateAdvantage 
                    ? `Flatrate sparar ${formatCurrency(Math.abs(savings))}/mån vid ${treatmentsPerDay} behandlingar/dag`
                    : `Per credit är ${formatCurrency(Math.abs(savings))} billigare/mån vid ${treatmentsPerDay} behandlingar/dag`
                  }
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FlatrateSection;