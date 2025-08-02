import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { generateRealisticGrowthData } from '@/utils/realisticDataGeneration';

const RealTimeProfitGraph: React.FC = () => {
  const { netResults, leasingCost, operatingCost } = useCalculator();
  
  const monthlyNet = netResults?.netPerMonthExVat || 0;
  const isProfitable = monthlyNet > 0;
  
  // Enkel gradvis ökning från 0 - realistisk uppbyggnad utan konstgjorda kurvor
  const data = Array.from({ length: 13 }, (_, i) => {
    if (i === 0) {
      return { month: 0, profit: 0, breakeven: 0 };
    }
    
    // Gradvis ramp-up över 6 månader, sedan stabilt resultat
    const rampUpFactor = Math.min(1, i / 6);
    const adjustedProfit = monthlyNet * rampUpFactor;
    
    return {
      month: i,
      profit: Math.round(adjustedProfit),
      breakeven: 0
    };
  });

  return (
    <div className="mt-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700">
            Månadsresultat (exkl. moms)
          </h4>
          <div className={`text-sm font-bold ${isProfitable ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrency(monthlyNet)}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {isProfitable ? '✅ Lönsam från månad 1' : '❌ Förlust varje månad'}
        </p>
      </div>
      
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <YAxis hide />
            <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="profit"
              stroke={isProfitable ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: isProfitable ? '#10b981' : '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-slate-500">
        Baserat på nuvarande inställningar
      </div>
    </div>
  );
};

export default RealTimeProfitGraph;