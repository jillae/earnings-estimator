
import React, { useEffect } from 'react';
import { formatCurrency } from '@/utils/calculatorUtils';
import { Info } from 'lucide-react';

interface OperatingCostsProps {
  usesCredits: boolean;
  useFlatrate: boolean;
  creditPrice: number;
  flatrateAmount: number;
  operatingCostPerMonth: number;
  allowBelowFlatrate: boolean;
}

const OperatingCosts: React.FC<OperatingCostsProps> = ({
  usesCredits,
  useFlatrate,
  creditPrice,
  flatrateAmount,
  operatingCostPerMonth,
  allowBelowFlatrate
}) => {
  if (!usesCredits) {
    return null;
  }
  
  // Debug logging to understand what's happening with the credit values
  useEffect(() => {
    console.log("OperatingCosts rendering with:", {
      creditPrice,
      operatingCostPerMonth,
      flatrateAmount,
      useFlatrate,
      allowBelowFlatrate
    });
  }, [creditPrice, operatingCostPerMonth, flatrateAmount, useFlatrate, allowBelowFlatrate]);
  
  // Visa olika innehåll baserat på om flatrate är aktiverat eller inte
  // Flatrate är aktiverat om allowBelowFlatrate är false och useFlatrate är true
  const flatrateEnabled = !allowBelowFlatrate && useFlatrate;
  
  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '400ms' }}>
      {flatrateEnabled ? (
        <>
          <label className="input-label">
            Credits Flatrate - credits efter behov (ex moms per månad)
          </label>
          <div className="flex justify-between items-center">
            <span className="text-sm">Fast månadsavgift</span>
            <span className="text-lg font-semibold text-slate-700">{formatCurrency(flatrateAmount, false)}</span>
          </div>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-base text-green-700 mb-2">Flatrate aktiverad</h3>
                <p className="text-green-800 mb-3">
                  Du har nu tillgång till obegränsat antal credits under avtalsperioden.
                </p>
                <p className="text-green-800 mb-2">
                  Vid en leasingkostnad som motsvarar minst 80% av den ordinarie 
                  investeringskostnaden erbjuds <strong>Flatrate för credits</strong>.
                </p>
                <p className="text-green-800">
                  Detta baseras på en förväntad minimibeläggning om 2 kunder per veckodag.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <label className="input-label">
            Credits Styckepris (ex moms per styck)
          </label>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">Pris per credit</span>
            <span className="text-lg font-semibold text-slate-700">{formatCurrency(creditPrice, false)}</span>
          </div>
          
          <label className="input-label">
            Credits kostnad per månad (ex moms)
          </label>
          <div className="flex justify-between items-center">
            <span className="text-sm">Credits kostnad</span>
            <span className="text-lg font-semibold text-slate-700">{formatCurrency(operatingCostPerMonth, false)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default OperatingCosts;
