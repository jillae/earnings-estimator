
import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { Info, Lock, Unlock } from 'lucide-react';
import { calculateFlatrateBreakEven } from '@/utils/creditUtils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface OperatingCostsProps {
  usesCredits: boolean;
  useFlatrate: boolean;
  creditPrice: number;
  flatrateAmount: number;
  operatingCostPerMonth: number;
  allowBelowFlatrate: boolean;
  leasingCostPercentage: number;
  treatmentsPerDay: number;
  onFlatrateOptionChange: (value: 'perCredit' | 'flatrate') => void;
  useFlatrateOption: 'perCredit' | 'flatrate';
}

const OperatingCosts: React.FC<OperatingCostsProps> = ({
  usesCredits,
  useFlatrate,
  creditPrice,
  flatrateAmount,
  operatingCostPerMonth,
  allowBelowFlatrate,
  leasingCostPercentage,
  treatmentsPerDay,
  onFlatrateOptionChange,
  useFlatrateOption
}) => {
  // Om maskinen inte använder credits, visa inget
  if (!usesCredits) {
    return null;
  }
  
  // Beräkna om flatrate är upplåst baserat på leasingCostPercentage
  const isFlatrateUnlocked = leasingCostPercentage >= 80 && treatmentsPerDay >= 3;
  
  // Beräkna ungefärlig kostnad för credits per månad baserat på creditPrice
  const treatmentsPerMonth = treatmentsPerDay * 22; // Använd 22 arbetsdagar per månad
  
  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '400ms' }}>
      <label className="input-label mb-4">
        Credits - Kostnader
      </label>
      
      <div className="flex items-center space-x-2 mb-4">
        <Label htmlFor="flatrate-switch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Flatrate för Credits
        </Label>
        <Switch
          id="flatrate-switch"
          checked={useFlatrateOption === 'flatrate'}
          onCheckedChange={(checked) => onFlatrateOptionChange(checked ? 'flatrate' : 'perCredit')}
          disabled={!isFlatrateUnlocked}
        />
      </div>
      
      {!isFlatrateUnlocked && (
        <p className="text-xs text-red-500 mb-4">
          Flatrate blir tillgängligt när leasingkostnaden når 80% eller mer och du anger minst 3 behandlingar per dag.
        </p>
      )}
      
      {useFlatrateOption === 'perCredit' ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">Pris per credit</span>
            <span className="text-lg font-semibold text-slate-700">{formatCurrency(creditPrice, false)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">Credits kostnad per månad</span>
            <span className="text-lg font-semibold text-slate-700">{formatCurrency(operatingCostPerMonth, false)}</span>
          </div>
        </>
      ) : isFlatrateUnlocked ? (
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm">Flatrate månadskostnad</span>
          <span className="text-lg font-semibold text-slate-700">{formatCurrency(flatrateAmount, false)}</span>
        </div>
      ) : null}
      
      {/* Visa olika informationsrutor beroende på status */}
      {useFlatrateOption === 'flatrate' && isFlatrateUnlocked ? (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-base text-emerald-700 mb-2">🎉 Grattis! Flatrate är aktiverat</h3>
              <p className="text-emerald-800 mb-3">
                Du har nu tillgång till obegränsat antal credits under avtalsperioden för en fast månadsavgift.
              </p>
              {flatrateAmount > 0 && creditPrice > 0 && (
                <p className="text-emerald-800 text-xs mt-2">
                  Vid {calculateFlatrateBreakEven(flatrateAmount, creditPrice)} eller fler behandlingar per dag är flatrate mer kostnadseffektivt än styckepris.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : isFlatrateUnlocked ? (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
          <div className="flex items-start gap-3">
            <Unlock className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-base text-emerald-700 mb-2">Supererbjudande Upplåst!</h3>
              <p className="text-emerald-800 mb-2">
                Du kvalificerar dig för vårt flatrate-erbjudande med obegränsade credits.
              </p>
              <p className="text-emerald-800 mb-2">
                Aktivera switchen ovan för obegränsade credits till fast pris: {formatCurrency(flatrateAmount, false)}/månad.
              </p>
              {flatrateAmount > 0 && creditPrice > 0 && (
                <p className="text-emerald-800 text-xs mt-2">
                  Vid {calculateFlatrateBreakEven(flatrateAmount, creditPrice)} eller fler behandlingar per dag är flatrate mer kostnadseffektivt än styckepris.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-base text-blue-700 mb-2">🔓 Lås upp vårt Supererbjudande!</h3>
              <p className="text-blue-800 mb-3">
                Obegränsat med credits till en fast månadskostnad.
              </p>
              <ul className="list-none space-y-2">
                <li className="flex items-center">
                  <span className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${leasingCostPercentage >= 80 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {leasingCostPercentage >= 80 ? '✓' : '○'}
                  </span>
                  <span>Justera leasingkostnaden till 80% eller mer</span>
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${treatmentsPerDay >= 3 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {treatmentsPerDay >= 3 ? '✓' : '○'}
                  </span>
                  <span>Ange 3 eller fler behandlingar per dag</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatingCosts;
