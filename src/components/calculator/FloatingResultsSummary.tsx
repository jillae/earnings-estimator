
import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

const FloatingResultsSummary = () => {
  const { netResults } = useCalculator();

  return (
    <div className="fixed bottom-3 right-3 z-30 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg shadow-sm hover:bg-white/90 hover:shadow-md transition-all duration-300">
      <div className="p-2">
        <div className="flex gap-3 text-xs">
          <div className="text-center">
            <div className="text-slate-500 mb-1">Netto/mån</div>
            <div className="font-bold text-blue-600 whitespace-nowrap text-sm">
              {formatCurrency(netResults.netPerMonthExVat)}
            </div>
          </div>
          <div className="w-px bg-slate-200"></div>
          <div className="text-center">
            <div className="text-slate-500 mb-1">Netto/år</div>
            <div className="font-bold text-emerald-600 whitespace-nowrap text-sm">
              {formatCurrency(netResults.netPerYearExVat)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingResultsSummary;

