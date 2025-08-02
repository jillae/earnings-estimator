import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

const StickyEconomicGraph: React.FC = () => {
  const { revenue, operatingCost, leasingCost, netResults } = useCalculator();
  
  const monthlyRevenue = revenue?.monthlyRevenueExVat || 0;
  const monthlyCosts = (operatingCost?.totalCost || 0) + (leasingCost || 0);
  const monthlyNet = netResults?.netPerMonthExVat || 0;

  // Använd useMemo för att memoize data-beräkningen
  const data = useMemo(() => {
    const result = [];
    let cumulativeRevenue = 0;
    let cumulativeCosts = 0;
    let cumulativeNet = 0;

    // Skapa data för 61 månader (5 år + startpunkt)
    for (let i = 0; i <= 60; i++) {
      if (i === 0) {
        // Startpunkt - allt är noll
        result.push({
          month: 0,
          cumulativeRevenue: 0,
          cumulativeCosts: 0,
          cumulativeNet: 0,
          monthlyRevenue: 0,
          monthlyCosts: 0,
          monthlyNet: 0
        });
      } else {
        // Gradvis ökning från månad 1 - realistisk uppbyggnad över 6 månader
        const rampUpFactor = Math.min(1, (i - 1) / 6);
        const currentRevenue = monthlyRevenue * rampUpFactor;
        const currentCosts = monthlyCosts; // Kostnader är konstanta från start
        const currentNet = currentRevenue - currentCosts;

        // Uppdatera kumulativa värden
        cumulativeRevenue += currentRevenue;
        cumulativeCosts += currentCosts;
        cumulativeNet += currentNet;
        
        result.push({
          month: i,
          cumulativeRevenue,
          cumulativeCosts,
          cumulativeNet,
          monthlyRevenue: currentRevenue,
          monthlyCosts: currentCosts,
          monthlyNet: currentNet
        });
      }
    }

    return result;
  }, [monthlyRevenue, monthlyCosts, monthlyNet]);

  const finalNet = data[data.length - 1]?.cumulativeNet || 0;
  const isPositive = finalNet > 0;
  const breakEvenMonth = data.find(d => d.cumulativeNet >= 0)?.month || 60;

  // Årliga resultat för tickets
  const yearlyResults = [
    { year: 1, month: 12, net: data[12]?.cumulativeNet || 0 },
    { year: 2, month: 24, net: data[24]?.cumulativeNet || 0 },
    { year: 3, month: 36, net: data[36]?.cumulativeNet || 0 },
    { year: 4, month: 48, net: data[48]?.cumulativeNet || 0 },
    { year: 5, month: 60, net: data[60]?.cumulativeNet || 0 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
      <div className="container max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Kumulativ Intäkt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Kumulativa Kostnader</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Kumulativt Netto</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">Break-even</p>
            <p className="font-bold">{breakEvenMonth === 60 ? '60+ mån' : `${breakEvenMonth} mån`}</p>
          </div>
        </div>

        <div className="h-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(value) => `År ${Math.floor(value/12)}`}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: any, name) => [
                  formatCurrency(value), 
                  name === 'cumulativeRevenue' ? 'Kumulativ Intäkt' :
                  name === 'cumulativeCosts' ? 'Kumulativa Kostnader' : 'Kumulativt Netto'
                ]}
                labelFormatter={(label) => {
                  const years = Math.floor(Number(label) / 12);
                  const months = Number(label) % 12;
                  return `År ${years}, Månad ${months}`;
                }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              
              {/* Break-even linje */}
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="2 2" />
              
              {/* Årliga referenslinjer */}
              {yearlyResults.map((year) => (
                <ReferenceLine 
                  key={year.year} 
                  x={year.month} 
                  stroke="#e2e8f0" 
                  strokeDasharray="1 1" 
                />
              ))}
              
              {/* Kumulativ intäkt */}
              <Line
                type="monotone"
                dataKey="cumulativeRevenue"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: '#22c55e' }}
              />
              
              {/* Kumulativa kostnader */}
              <Line
                type="monotone"
                dataKey="cumulativeCosts"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: '#ef4444' }}
              />
              
              {/* Kumulativt netto */}
              <Line
                type="monotone"
                dataKey="cumulativeNet"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Årliga summerings-tickets */}
          {yearlyResults.map((year, index) => {
            const xPosition = ((year.month / 60) * 100) - 2; // Ungefärlig position baserat på procentandel
            const isPositive = year.net > 0;
            
            return (
              <div
                key={year.year}
                className="absolute top-1 bg-white border rounded-md shadow-sm px-2 py-1 text-xs"
                style={{ 
                  left: `${xPosition}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="text-center">
                  <div className="text-muted-foreground">År {year.year}</div>
                  <div className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(year.net)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StickyEconomicGraph;