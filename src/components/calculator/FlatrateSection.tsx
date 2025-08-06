import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { useFlatrateHandler } from '@/hooks/useFlatrateHandler';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatUtils';
import { Info, CheckCircle2, XCircle } from 'lucide-react';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';
import FlatrateCard from './FlatrateCard';
import PerCreditCard from './PerCreditCard';
import { calculateFlatrateEconomics, getFlatrateRecommendationText } from '@/utils/credits/flatrateEconomics';

const FlatrateSection: React.FC = () => {
  const {
    selectedMachine,
    paymentOption,
    selectedDriftpaket,
    treatmentsPerDay,
    creditPrice,
    selectedSlaLevel,
  } = useCalculator();

  const { useFlatrateOption, handleFlatrateChange, canEnableFlatrate } = useFlatrateHandler();

  // Visa endast för maskiner som använder credits och inte är på maxposition (där credits är 0)
  if (!selectedMachine?.usesCredits) {
    return null;
  }

  // KRITISK EKONOMISK ANALYS - Gränsvärde: fler än 2 behandlingar per dag
  const flatrateEconomics = calculateFlatrateEconomics(
    treatmentsPerDay,
    selectedMachine,
    creditPrice || 0,
    selectedSlaLevel
  );
  
  const recommendation = getFlatrateRecommendationText(flatrateEconomics);
  
  // Beräkna kostnader för jämförelse (gamla logiken behålls för bakåtkompatibilitet)
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
      <div className="flex items-center justify-center mb-4">
        <h3 className="text-lg font-semibold">Betalningsmodell för Credits</h3>
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

          {/* Flatrate Card - med ekonomisk analys */}
          <FlatrateCard
            isSelected={useFlatrateOption === 'flatrate'}
            isEnabled={canEnableFlatrate}
            onSelect={handleFlatrateSelect}
            flatrateCost={flatrateCost}
            discountText={getFlatrateDiscount()}
            selectedSlaLevel={selectedSlaLevel}
            isEconomicallyViable={flatrateEconomics.isEconomicallyViable}
            recommendationText={recommendation.description}
            recommendationType={recommendation.type}
          />
        </div>

        {/* KRITISK BESPARINGSINDIKATOR MED EKONOMISK ANALYS */}
        {treatmentsPerDay > 0 && (
          <div className={`p-4 rounded-lg border-2 ${
            flatrateEconomics.isEconomicallyViable && isFlatrateAdvantage 
              ? 'bg-green-50 border-green-300' 
              : !flatrateEconomics.isEconomicallyViable
              ? 'bg-orange-50 border-orange-300'
              : 'bg-blue-50 border-blue-300'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">
                {flatrateEconomics.isEconomicallyViable && isFlatrateAdvantage 
                  ? '💰' 
                  : !flatrateEconomics.isEconomicallyViable 
                  ? '⚠️' 
                  : '💡'}
              </span>
              <div>
                <div className={`font-bold text-lg mb-2 ${
                  flatrateEconomics.isEconomicallyViable && isFlatrateAdvantage 
                    ? 'text-green-700' 
                    : !flatrateEconomics.isEconomicallyViable
                    ? 'text-orange-700'
                    : 'text-blue-700'
                }`}>
                  {recommendation.title}
                </div>
                <div className={`text-sm ${
                  flatrateEconomics.isEconomicallyViable && isFlatrateAdvantage 
                    ? 'text-green-600' 
                    : !flatrateEconomics.isEconomicallyViable
                    ? 'text-orange-600'
                    : 'text-blue-600'
                }`}>
                  {recommendation.description}
                </div>
                {/* Extra detaljer */}
                <div className="text-xs text-slate-500 mt-2">
                  Brytpunkt för lönsamhet: {flatrateEconomics.breakEvenPoint.toFixed(1)} behandlingar per dag
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FlatrateSection;