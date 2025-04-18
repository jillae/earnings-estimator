
import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

const FloatingResultsSummary = () => {
  const { netResults } = useCalculator();

  return (
    <div className="fixed bottom-4 right-4 z-50 glass-card shadow-lg animate-slide-in bg-white/90 backdrop-blur-lg border border-emerald-100">
      <div className="p-4">
        <h3 className="text-sm font-medium text-slate-600 mb-2">Nettoresultat per år</h3>
        <div className="text-2xl font-bold text-emerald-600">
          {formatCurrency(netResults.netPerYearExVat)}
        </div>
        <div className="text-sm text-slate-500 mt-1">exkl. moms</div>
      </div>
    </div>
  );
};

export default FloatingResultsSummary;
