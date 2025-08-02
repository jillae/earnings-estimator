import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { generateRealisticGrowthData } from '@/utils/realisticDataGeneration';
const RealTimeProfitGraph: React.FC = () => {
  const {
    netResults,
    leasingCost,
    operatingCost
  } = useCalculator();
  const monthlyNet = netResults?.netPerMonthExVat || 0;
  const isProfitable = monthlyNet > 0;

  // Enkel gradvis ökning från 0 - realistisk uppbyggnad utan konstgjorda kurvor
  const data = Array.from({
    length: 13
  }, (_, i) => {
    if (i === 0) {
      return {
        month: 0,
        profit: 0,
        breakeven: 0
      };
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
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
          <Line 
            type="monotone" 
            dataKey="profit" 
            stroke={isProfitable ? "hsl(var(--success))" : "hsl(var(--destructive))"} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RealTimeProfitGraph;