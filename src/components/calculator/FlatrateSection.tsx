import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { useFlatrateHandler } from '@/hooks/useFlatrateHandler';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatUtils';
import { CreditCard, Calculator, Info, CheckCircle2, XCircle } from 'lucide-react';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';

const FlatrateSection: React.FC = () => {
  const {
    selectedMachine,
    paymentOption,
    selectedDriftpaket,
    treatmentsPerDay,
    creditPrice,
    selectedSlaLevel
  } = useCalculator();

  const { useFlatrateOption, handleFlatrateChange, canEnableFlatrate } = useFlatrateHandler();

  // Visa endast för maskiner som använder credits
  if (!selectedMachine?.usesCredits) {
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
    if (selectedSlaLevel === 'Silver') return '50% rabatt';
    if (selectedSlaLevel === 'Guld') return 'Gratis (100% rabatt)';
    return '';
  };

  return (
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '350ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Betalningsmodell för Credits</h3>
        <Badge variant={useFlatrateOption === 'flatrate' ? 'default' : 'secondary'}>
          {useFlatrateOption === 'flatrate' ? 'Flatrate' : 'Per Credit'}
        </Badge>
      </div>
      
      {/* Toggle med förbättrad UI */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Switch 
                id="flatrate-toggle"
                checked={useFlatrateOption === 'flatrate'}
                onCheckedChange={handleFlatrateChange}
                disabled={!canEnableFlatrate}
              />
              <Label htmlFor="flatrate-toggle" className="font-medium">
                Aktivera Flatrate
              </Label>
            </div>
            {getFlatrateDiscount() && (
              <Badge variant="outline" className="text-green-700 border-green-300">
                {getFlatrateDiscount()}
              </Badge>
            )}
          </div>
          
          {!canEnableFlatrate && paymentOption === 'leasing' && (
            <div className="text-xs text-orange-600 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Kräver standard leasingnivå eller högre
            </div>
          )}
        </div>

        {/* Kostnadsjämförelse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Per Credit Option */}
          <div className={`p-4 border rounded-lg ${useFlatrateOption === 'perCredit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium">Per Credit</h4>
              {useFlatrateOption === 'perCredit' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                {formatCurrency(creditPrice || 0)} × {totalCreditsPerMonth} credits/mån
              </div>
              <div className="text-lg font-semibold text-blue-600">
                {formatCurrency(creditsCostPerMonth)}/mån
              </div>
              <div className="text-xs text-gray-500">
                Flexibel - betala endast för vad du använder
              </div>
            </div>
          </div>

          {/* Flatrate Option */}
          <div className={`p-4 border rounded-lg ${useFlatrateOption === 'flatrate' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <h4 className="font-medium">Flatrate</h4>
              {useFlatrateOption === 'flatrate' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                Obegränsad användning
              </div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(flatrateCost)}/mån
              </div>
              <div className="text-xs text-gray-500">
                Fast kostnad - förutsägbar budgetering
              </div>
              {getFlatrateDiscount() && (
                <div className="text-xs font-medium text-green-700">
                  Med {selectedSlaLevel}: {getFlatrateDiscount()}
                </div>
              )}
            </div>
          </div>
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

        {/* Informationsruta */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <strong>Tips:</strong> Flatrate är ekonomiskt fördelaktigt vid högre behandlingsvolymer. 
              Med Silver/Guld SLA-paket får du ytterligare rabatt på Flatrate-kostnaden.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlatrateSection;