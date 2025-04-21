
import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

const FloatingResultsSummary = () => {
  const { netResults } = useCalculator();

  return (
    <div className="fixed bottom-4 right-4 z-50 glass-card shadow-lg animate-slide-in bg-white/90 backdrop-blur-lg border border-emerald-100">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">Netto per månad</h3>
            <div className="text-xl font-bold text-blue-600">
              {formatCurrency(netResults.netPerMonthExVat)}
            </div>
            <div className="text-xs text-slate-500">exkl. moms</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">Netto per år</h3>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(netResults.netPerYearExVat)}
            </div>
            <div className="text-xs text-slate-500">exkl. moms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingResultsSummary;
