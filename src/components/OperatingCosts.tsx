
import React, { useEffect } from 'react';
import { formatCurrency } from '@/utils/calculatorUtils';
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from 'lucide-react';

interface OperatingCostsProps {
  usesCredits: boolean;
  useFlatrate: boolean;
  creditPrice: number;
  flatrateAmount: number;
  operatingCostPerMonth: number;
  onCreditPriceChange?: (value: number) => void;
}

const OperatingCosts: React.FC<OperatingCostsProps> = ({
  usesCredits,
  useFlatrate,
  creditPrice,
  flatrateAmount,
  operatingCostPerMonth,
  onCreditPriceChange
}) => {
  if (!usesCredits) {
    return null;
  }
  
  const handleCreditPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && onCreditPriceChange) {
      console.log("Changing credit price to:", value);
      onCreditPriceChange(value);
    }
  };
  
  const incrementCreditPrice = () => {
    if (onCreditPriceChange) {
      const newValue = creditPrice + 1;
      console.log("Incrementing credit price to:", newValue);
      onCreditPriceChange(newValue);
    }
  };
  
  const decrementCreditPrice = () => {
    if (onCreditPriceChange && creditPrice > 1) {
      const newValue = creditPrice - 1;
      console.log("Decrementing credit price to:", newValue);
      onCreditPriceChange(newValue);
    }
  };
  
  // Debug logging to understand what's happening
  useEffect(() => {
    console.log("OperatingCosts rendering with:", {
      creditPrice,
      operatingCostPerMonth,
      flatrateAmount,
      useFlatrate,
      hasChangeHandler: !!onCreditPriceChange
    });
  }, [creditPrice, operatingCostPerMonth, flatrateAmount, useFlatrate, onCreditPriceChange]);
  
  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '400ms' }}>
      {useFlatrate ? (
        <>
          <label className="input-label">
            Credits Flatrate - credits efter behov (ex moms per månad)
          </label>
          <div className="flex justify-between items-center">
            <span className="text-sm">Fast månadsavgift</span>
            <span className="text-lg font-semibold text-slate-700">{formatCurrency(flatrateAmount, false)}</span>
          </div>
        </>
      ) : (
        <>
          <label className="input-label">
            Credits Styckepris (ex moms per styck)
          </label>
          {onCreditPriceChange ? (
            <div className="flex items-center mb-4">
              <div className="relative flex-grow">
                <Input
                  type="number"
                  min="1"
                  value={creditPrice}
                  onChange={handleCreditPriceChange}
                  className="w-full pr-16"
                />
                <div className="absolute right-0 top-0 h-full flex flex-col">
                  <button 
                    type="button" 
                    onClick={incrementCreditPrice}
                    className="flex-1 px-2 border-l border-b border-input flex items-center justify-center hover:bg-gray-100"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={decrementCreditPrice}
                    className="flex-1 px-2 border-l border-input flex items-center justify-center hover:bg-gray-100"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Pris per credit</span>
              <span className="text-lg font-semibold text-slate-700">{formatCurrency(creditPrice, false)}</span>
            </div>
          )}
          
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
