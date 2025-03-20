
import React, { useEffect } from 'react';
import { formatCurrency } from '@/utils/calculatorUtils';
import { Info, Lock, Unlock } from 'lucide-react';
import { calculateFlatrateBreakEven } from '@/utils/creditUtils';

interface OperatingCostsProps {
  usesCredits: boolean;
  useFlatrate: boolean;
  creditPrice: number;
  flatrateAmount: number;
  operatingCostPerMonth: number;
  allowBelowFlatrate: boolean;
  leasingCostPercentage?: number;
  treatmentsPerDay: number;
  onFlatrateOptionChange?: (useFlatrate: boolean) => void;
}

const OperatingCosts: React.FC<OperatingCostsProps> = ({
  usesCredits,
  useFlatrate,
  creditPrice,
  flatrateAmount,
  operatingCostPerMonth,
  allowBelowFlatrate,
  leasingCostPercentage = 0,
  treatmentsPerDay,
  onFlatrateOptionChange
}) => {
  if (!usesCredits) {
    return null;
  }
  
  // Det omvända villkoret för flatrate är aktiverat (baserat på slider position och behandlingar)
  const isFlatrateUnlocked = leasingCostPercentage >= 80 && treatmentsPerDay >= 3;
  
  // Beräkna brytpunkten för när flatrate blir mer kostnadseffektivt
  const breakEvenTreatments = calculateFlatrateBreakEven(flatrateAmount, creditPrice);
  
  // Hantera byte av prismodell
  const handleFlatrateOptionChange = (value: string) => {
    if (onFlatrateOptionChange) {
      onFlatrateOptionChange(value === 'flatrate');
    }
  };
  
  // Debug-loggning
  useEffect(() => {
    console.log("OperatingCosts rendering with:", {
      isFlatrateUnlocked,
      leasingCostPercentage,
      treatmentsPerDay,
      creditPrice,
      flatrateAmount,
      breakEvenTreatments
    });
  }, [isFlatrateUnlocked, leasingCostPercentage, treatmentsPerDay, creditPrice, flatrateAmount, breakEvenTreatments]);
  
  // Om switch-reglaget för flatrate redan är aktiverat (allowBelowFlatrate är false),
  // visa ingen radioknapp för flatrate-val
  if (!allowBelowFlatrate && isFlatrateUnlocked) {
    return (
      <div className="input-group animate-slide-in" style={{ animationDelay: '400ms' }}>
        <label className="input-label mb-4">
          Credits - Kostnader
        </label>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm">Flatrate månadskostnad</span>
          <span className="text-lg font-semibold text-slate-700">{formatCurrency(flatrateAmount, false)}</span>
        </div>
        
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-base text-emerald-700 mb-2">🎉 Grattis! Flatrate är aktiverat</h3>
              <p className="text-emerald-800 mb-3">
                Du har nu tillgång till obegränsat antal credits under avtalsperioden för en fast månadsavgift.
              </p>
              {breakEvenTreatments > 0 && (
                <p className="text-emerald-800 text-xs mt-2">
                  Vid {breakEvenTreatments} eller fler behandlingar per dag är flatrate mer kostnadseffektivt än styckepris.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Visa ALDRIG radioknapparna om flatrate-switch är aktiverad
  if (!allowBelowFlatrate) {
    return (
      <div className="input-group animate-slide-in" style={{ animationDelay: '400ms' }}>
        <label className="input-label mb-4">
          Credits - Kostnader
        </label>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm">Flatrate månadskostnad</span>
          <span className="text-lg font-semibold text-slate-700">{formatCurrency(flatrateAmount, false)}</span>
        </div>
        
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-base text-emerald-700 mb-2">🎉 Grattis! Flatrate är aktiverat</h3>
              <p className="text-emerald-800 mb-3">
                Du har nu tillgång till obegränsat antal credits under avtalsperioden för en fast månadsavgift.
              </p>
              {breakEvenTreatments > 0 && (
                <p className="text-emerald-800 text-xs mt-2">
                  Vid {breakEvenTreatments} eller fler behandlingar per dag är flatrate mer kostnadseffektivt än styckepris.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Visa radioknapparna när FlatrateToggle inte är aktiverad (allowBelowFlatrate är true) och villkoren för flatrate är uppfyllda
  if (allowBelowFlatrate && isFlatrateUnlocked) {
    return (
      <div className="input-group animate-slide-in" style={{ animationDelay: '400ms' }}>
        <label className="input-label mb-4">
          Credits - Kostnader
        </label>
        
        <div className="mb-4">
          <div className="flex items-center space-x-2 py-2">
            <input 
              type="radio" 
              id="styckepris" 
              name="priceModel" 
              value="styckepris" 
              checked={!useFlatrate} 
              onChange={() => onFlatrateOptionChange?.(false)}
              className="h-4 w-4 text-primary"
            />
            <label htmlFor="styckepris" className="text-sm font-medium cursor-pointer">
              Credits styckepris
            </label>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <input 
              type="radio" 
              id="flatrate" 
              name="priceModel" 
              value="flatrate" 
              checked={useFlatrate} 
              onChange={() => onFlatrateOptionChange?.(true)}
              className="h-4 w-4 text-primary"
            />
            <label htmlFor="flatrate" className="text-sm font-medium cursor-pointer">
              Credits flatrate (obegränsade credits)
            </label>
          </div>
        </div>
        
        {useFlatrate ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Flatrate månadskostnad</span>
              <span className="text-lg font-semibold text-slate-700">{formatCurrency(flatrateAmount, false)}</span>
            </div>
            
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-base text-emerald-700 mb-2">🎉 Grattis! Flatrate är aktiverat</h3>
                  <p className="text-emerald-800 mb-3">
                    Du har nu tillgång till obegränsat antal credits under avtalsperioden för en fast månadsavgift.
                  </p>
                  {breakEvenTreatments > 0 && (
                    <p className="text-emerald-800 text-xs mt-2">
                      Vid {breakEvenTreatments} eller fler behandlingar per dag är flatrate mer kostnadseffektivt än styckepris.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Pris per credit</span>
              <span className="text-lg font-semibold text-slate-700">{formatCurrency(creditPrice, false)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Credits kostnad per månad</span>
              <span className="text-lg font-semibold text-slate-700">{formatCurrency(operatingCostPerMonth, false)}</span>
            </div>
            
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
              <div className="flex items-start gap-3">
                <Unlock className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-base text-emerald-700 mb-2">Supererbjudande Upplåst!</h3>
                  <p className="text-emerald-800 mb-2">
                    Du kvalificerar dig för vårt flatrate-erbjudande med obegränsade credits.
                  </p>
                  <p className="text-emerald-800 mb-2">
                    Välj flatrate ovan för att aktivera obegränsade credits till fast pris: {formatCurrency(flatrateAmount, false)}/månad.
                  </p>
                  {breakEvenTreatments > 0 && (
                    <p className="text-emerald-800 text-xs mt-2">
                      Vid {breakEvenTreatments} eller fler behandlingar per dag är flatrate mer kostnadseffektivt än styckepris.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  
  // Grundläggande vy när flatrate inte är upplåst
  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '400ms' }}>
      <label className="input-label mb-4">
        Credits - Kostnader
      </label>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm">Pris per credit</span>
        <span className="text-lg font-semibold text-slate-700">{formatCurrency(creditPrice, false)}</span>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm">Credits kostnad per månad</span>
        <span className="text-lg font-semibold text-slate-700">{formatCurrency(operatingCostPerMonth, false)}</span>
      </div>
      
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
    </div>
  );
};

export default OperatingCosts;
