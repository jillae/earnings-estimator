
import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

const FloatingResultsSummary = () => {
  const { netResults } = useCalculator();

  return (
    <div className="fixed bottom-4 right-4 z-50 glass-card shadow-2xl animate-slide-in bg-white/95 backdrop-blur-lg border border-emerald-200 rounded-xl">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-[280px]">
          <div className="text-center">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Netto per månad</h3>
            <div className="text-xl font-bold text-blue-600 whitespace-nowrap">
              {formatCurrency(netResults.netPerMonthExVat)}
            </div>
            <div className="text-xs text-slate-500 mt-1">exkl. moms</div>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Netto per år</h3>
            <div className="text-xl font-bold text-emerald-600 whitespace-nowrap">
              {formatCurrency(netResults.netPerYearExVat)}
            </div>
            <div className="text-xs text-slate-500 mt-1">exkl. moms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingResultsSummary;

