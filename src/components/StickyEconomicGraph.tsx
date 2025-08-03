import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

const StickyEconomicGraph: React.FC = () => {
  const { revenue, operatingCost, leasingCost, netResults } = useCalculator();
  const [selectedYear, setSelectedYear] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');
  const [opacity, setOpacity] = useState<number>(80);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  
  // ANVÄND EXAKT SAMMA VÄRDEN SOM TABELLEN
  const monthlyRevenue = revenue?.monthlyRevenueIncVat || 0; // Bruttointäkt inkl VAT (visas i tabell)
  const monthlyNet = netResults?.netPerMonthExVat || 0; // Netto ex VAT (samma som tabell)
  
  // Beräkna kostnader bakvänt från netto och intäkt för att säkerställa konsistens
  const monthlyRevenueExVat = monthlyRevenue / 1.25; // Konvertera till ex VAT
  const monthlyCosts = monthlyRevenueExVat - monthlyNet; // Bakvänd beräkning för exakt samma resultat


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
  const allYearlyResults = [
    { year: 1, month: 12, net: data[12]?.cumulativeNet || 0 },
    { year: 2, month: 24, net: data[24]?.cumulativeNet || 0 },
    { year: 3, month: 36, net: data[36]?.cumulativeNet || 0 },
    { year: 4, month: 48, net: data[48]?.cumulativeNet || 0 },
    { year: 5, month: 60, net: data[60]?.cumulativeNet || 0 },
  ];

  // Filtrera tickets baserat på valt år
  const yearlyResults = useMemo(() => {
    if (selectedYear === 'all') return allYearlyResults;
    const yearNum = parseInt(selectedYear);
    return allYearlyResults.filter(year => year.year === yearNum);
  }, [allYearlyResults, selectedYear]);

  // Filter data baserat på valt år
  const filteredData = useMemo(() => {
    if (selectedYear === 'all') return data;
    const yearNum = parseInt(selectedYear);
    const startMonth = (yearNum - 1) * 12;
    const endMonth = yearNum * 12;
    return data.slice(startMonth, endMonth + 1);
  }, [data, selectedYear]);

  return (
    <div className={`fixed bottom-0 left-0 right-0 border-t shadow-lg z-40 transition-all duration-300 ${
      isExpanded ? 'transform translate-y-0' : 'transform translate-y-full'
    }`} style={{ backgroundColor: `rgba(255, 255, 255, ${opacity / 100})` }}>
      
      {/* Toggle knapp */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -top-10 left-1/2 transform -translate-x-1/2 rounded-t-md rounded-b-none px-3 py-2 h-10 bg-background border border-b-0 shadow-md hover:bg-muted"
        variant="outline"
      >
        {isExpanded ? (
          <>
            <ChevronDown className="h-4 w-4 mr-1" />
            <span className="text-xs">Dölj Graf</span>
          </>
        ) : (
          <>
            <ChevronUp className="h-4 w-4 mr-1" />
            <span className="text-xs">Visa Graf</span>
          </>
        )}
      </Button>

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

          <div className="flex items-center gap-4">
            {/* Årsväljare med knappar */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Visa:</span>
              <div className="flex rounded-md border border-input bg-background">
                {(['all', '1', '2', '3', '4', '5'] as const).map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      selectedYear === year
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    } ${year === 'all' ? 'rounded-l-md' : ''} ${year === '5' ? 'rounded-r-md' : ''}`}
                  >
                    {year === 'all' ? 'Alla' : `År ${year}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Transparens-kontroll */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Transparens:</span>
              <input
                type="range"
                min="50"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-16 h-2"
              />
              <span className="text-xs text-muted-foreground w-8">{opacity}%</span>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground text-sm">Break-even</p>
              <p className="font-bold">{breakEvenMonth === 60 ? '60+ mån' : `${breakEvenMonth} mån`}</p>
            </div>
          </div>
        </div>

        <div className="h-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                ticks={selectedYear === 'all' ? 
                  [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60] :
                  filteredData.map((_, i) => i).filter(i => i % 2 === 0)
                }
                tickFormatter={(value) => {
                  if (selectedYear === 'all') {
                    if (value === 0) return 'Start';
                    const year = Math.floor(value / 12);
                    const quarter = Math.floor((value % 12) / 3) + 1;
                    return year === 0 ? `Q${quarter}` : `År${year} Q${quarter}`;
                  } else {
                    return `M${value + 1}`;
                  }
                }}
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
                  if (selectedYear === 'all') {
                    const years = Math.floor(Number(label) / 12);
                    const months = Number(label) % 12;
                    return `År ${years}, Månad ${months}`;
                  } else {
                    return `Månad ${Number(label) + 1} (År ${selectedYear})`;
                  }
                }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '12px',
                  zIndex: 50
                }}
                wrapperStyle={{ zIndex: 50 }}
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
          
          {/* Årliga summerings-tickets - filtreras baserat på valt år */}
          {yearlyResults.map((year, index) => {
            // Justera position baserat på om vi visar alla år eller ett specifikt år
            const xPosition = selectedYear === 'all' 
              ? ((year.month / 60) * 100) - 2  // Original logik för alla år
              : 85; // Fast position för enskilt år
            const isPositive = year.net > 0;
            
            return (
              <div
                key={year.year}
                className="absolute top-1 bg-white border rounded-md shadow-sm px-2 py-1 text-xs z-10"
                style={{ 
                  left: `${xPosition}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="text-center">
                  <div className="text-muted-foreground">År {year.year}</div>
                  <div className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.round(year.net))}
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