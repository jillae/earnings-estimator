
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCalculator } from '@/context/calculator/context';
import { formatCurrency } from '@/utils/formatUtils';
import { calculateFlatrateBreakEven } from '@/utils/creditUtils';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Lock, Unlock } from 'lucide-react';

const OperatingCosts: React.FC = () => {
  const { 
    leasingCost, 
    leasingRange, 
    selectedMachine, 
    useFlatrateOption, 
    setUseFlatrateOption, 
    treatmentsPerDay, 
    exchangeRate,
    leasingCostPercentage
  } = useCalculator();

  // Se till att vi har giltiga värden
  const validLeasingRange = leasingRange || { min: 0, max: 0 };
  const eightyPercentOfMaxLeasing = validLeasingRange.max ? validLeasingRange.max * 0.8 : 0;
  const isFlatrateUnlocked = leasingCost >= eightyPercentOfMaxLeasing && treatmentsPerDay >= 3;

  // Använd flatrateAmount direkt från den valda maskinen
  const flatrateAmount = selectedMachine?.flatrateAmount || 0;
  
  // Använd creditMin och creditMax värdet från den valda maskinen
  const creditMin: number = selectedMachine?.creditMin || 0;
  const creditMax: number = selectedMachine?.creditMax || 0;
  const hasCreditRange = creditMin !== creditMax && creditMin > 0 && creditMax > 0;
  
  // Direkt beräkning av kostnad per månad för credits
  const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  const creditsCostPerMonth = selectedMachine?.usesCredits ? treatmentsPerMonth * creditMin : 0;

  // Hantera flatrate-switch
  const handleFlatrateChange = (checked: boolean) => {
    console.log(`Flatrate switch ändrad till: ${checked}`);
    setUseFlatrateOption(checked ? 'flatrate' : 'perCredit');
  };

  // Bestäm vilken informationsruta som ska visas
  const renderFlatrateAlert = () => {
    if (useFlatrateOption === 'flatrate' && isFlatrateUnlocked) {
      // Flatrate är aktiverat
      return (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <Unlock className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Flatrate är aktiverat</AlertTitle>
          <AlertDescription className="text-green-600">
            Du har valt flatrate för dina credits, vilket innebär en fast månadskostnad oavsett antalet behandlingar.
          </AlertDescription>
        </Alert>
      );
    } else if (isFlatrateUnlocked && useFlatrateOption !== 'flatrate') {
      // Flatrate är tillgängligt men inte aktiverat
      return (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <Unlock className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Flatrate tillgängligt</AlertTitle>
          <AlertDescription className="text-green-600">
            Med din nuvarande leasingkostnad och antal behandlingar har du möjlighet att aktivera flatrate för en fast månadskostnad.
          </AlertDescription>
        </Alert>
      );
    } else if (!isFlatrateUnlocked) {
      // Flatrate är inte tillgängligt
      return (
        <Alert className="mt-4 bg-blue-50 border-blue-200">
          <Lock className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-700">Flatrate ej tillgängligt</AlertTitle>
          <AlertDescription className="text-blue-600">
            För att låsa upp flatrate behöver din leasingkostnad nå minst 80% av max och du behöver ange minst 3 behandlingar per dag.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '400ms' }}>
      <label className="input-label mb-4">
        Credits - Kostnader
      </label>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="flatrate-switch"
            checked={useFlatrateOption === 'flatrate'}
            onCheckedChange={handleFlatrateChange}
            disabled={!isFlatrateUnlocked && useFlatrateOption !== 'flatrate'}
          />
          <Label htmlFor="flatrate-switch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Flatrate för Credits
          </Label>
        </div>
        <span className="text-sm text-gray-500">
          {useFlatrateOption === 'flatrate' ? 'Flatrate' : 'Styckepris'}
        </span>
      </div>

      {renderFlatrateAlert()}

      {selectedMachine?.usesCredits && (
        <>
          {useFlatrateOption === 'perCredit' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Pris per credit</span>
                <span className="text-lg font-semibold text-slate-700">
                  {formatCurrency(creditMin, false)}
                  {hasCreditRange && (
                    <span className="text-xs text-slate-500 ml-1">
                      (Intervall: {formatCurrency(creditMin, false)} - {formatCurrency(creditMax, false)})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Credits kostnad per månad</span>
                <span className="text-lg font-semibold text-slate-700">{formatCurrency(creditsCostPerMonth, false)}</span>
              </div>
            </>
          )}

          {useFlatrateOption === 'flatrate' && isFlatrateUnlocked && (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Flatrate månadskostnad</span>
                <span className="text-lg font-semibold text-slate-700">{formatCurrency(flatrateAmount, false)}</span>
              </div>
              <p className="text-xs text-green-500 mb-2">Obegränsat antal behandlingar ingår.</p>
            </>
          )}

          {flatrateAmount > 0 && useFlatrateOption === 'perCredit' && (
            <p className="text-xs text-blue-500">
              Vid ca {calculateFlatrateBreakEven(flatrateAmount, creditMin)} eller fler behandlingar per dag kan flatrate vara mer kostnadseffektivt än styckepris.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default OperatingCosts;
