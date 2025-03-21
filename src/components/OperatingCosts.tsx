
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCalculator } from '@/context/calculator/context';
import { formatCurrency } from '@/utils/formatUtils';
import { calculateFlatrateBreakEven } from '@/utils/creditUtils';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';

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

  const flatrateAmount = selectedMachine?.flatrateAmount || 0;
  
  // Fasta värden för creditMin och creditMax - som nummer
  const creditMin = 149;
  const creditMax = 299;
  
  // Visa prisintervall om både min och max finns och är olika
  const hasCreditRange = creditMin !== creditMax;
  
  // Beräkna aktuellt kreditpris baserat på leasingkostnadens position
  // När leasing är MIN -> creditMax, när leasing är MAX -> creditMin
  const creditRange = creditMax - creditMin;
  const percentage = (100 - leasingCostPercentage) / 100; // Inverterar procenten (låg leasing = hög credit)
  const dynamicCreditPrice = creditMin + (percentage * creditRange);
  
  // Direkt beräkning av kostnad per månad för credits
  const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  const creditsCostPerMonth = selectedMachine?.usesCredits ? treatmentsPerMonth * dynamicCreditPrice : 0;

  // Hantera flatrate-switch
  const handleFlatrateChange = (checked: boolean) => {
    console.log(`Flatrate switch ändrad till: ${checked}`);
    setUseFlatrateOption(checked ? 'flatrate' : 'perCredit');
  };

  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '400ms' }}>
      <label className="input-label mb-4">
        Credits - Kostnader
      </label>

      <div className="flex items-center space-x-2 mb-2">
        <Label htmlFor="flatrate-switch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Flatrate för Credits
        </Label>
        <Switch
          id="flatrate-switch"
          checked={useFlatrateOption === 'flatrate'}
          onCheckedChange={handleFlatrateChange}
          disabled={!isFlatrateUnlocked}
        />
      </div>

      {!isFlatrateUnlocked && (
        <p className="text-xs text-red-500 mb-2">Flatrate blir tillgängligt när leasingkostnaden når {Math.round(eightyPercentOfMaxLeasing)} kr eller mer och du anger minst 3 behandlingar per dag.</p>
      )}

      {selectedMachine?.usesCredits && (
        <>
          {useFlatrateOption === 'perCredit' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Pris per credit</span>
                <span className="text-lg font-semibold text-slate-700">
                  {hasCreditRange 
                    ? (
                      <>
                        <span>{formatCurrency(dynamicCreditPrice, false)}</span>
                        <span className="text-xs text-slate-500 ml-1">
                          (Intervall: {formatCurrency(creditMin, false)} - {formatCurrency(creditMax, false)})
                        </span>
                      </>
                    )
                    : formatCurrency(dynamicCreditPrice, false)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Credits kostnad per månad</span>
                <span className="text-lg font-semibold text-slate-700">{formatCurrency(creditsCostPerMonth, false)}</span>
              </div>
              <p className="text-xs text-blue-500 mb-2">Styckepris per behandling används.</p>
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
              Vid ca {calculateFlatrateBreakEven(flatrateAmount, dynamicCreditPrice)} eller fler behandlingar per dag kan flatrate vara mer kostnadseffektivt än styckepris.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default OperatingCosts;
