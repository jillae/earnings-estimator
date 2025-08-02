import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { generateRealisticGrowthData } from '@/utils/realisticDataGeneration';

const RealTimeProfitGraph: React.FC = () => {
  const { netResults, leasingCost, operatingCost } = useCalculator();
  
  const monthlyNet = netResults?.netPerMonthExVat || 0;
  const isProfitable = monthlyNet > 0;
  
  // Skapa realistisk data med fluktuationer
  const realisticData = generateRealisticGrowthData(monthlyNet, 2, 12, 0.12);
  const data = realisticData.map((point) => ({
    month: point.month,
    profit: point.value,
    breakeven: 0,
    confidence: point.confidence
  }));

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