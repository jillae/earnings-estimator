import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

const DetailedAnalysisModal: React.FC = () => {
  const { 
    revenue, 
    netResults, 
    leasingCost,
    operatingCost,
    selectedMachineId,
    selectedMachine,
    paymentOption,
    cashPriceSEK
  } = useCalculator();

  // Data för huvudgrafen - månadsvis utveckling över 5 år (förbättrad)
  const monthlyData = [];
  const monthlyRevenue = revenue.monthlyRevenueExVat;
  const monthlyCost = leasingCost + operatingCost.totalCost;
  const monthlyNet = netResults.netPerMonthExVat;
  
  for (let month = 1; month <= 60; month++) {
    // Kumulativa värden över tid
    const cumulativeRevenue = monthlyRevenue * month;
    const cumulativeCosts = monthlyCost * month;
    const cumulativeNet = monthlyNet * month;
    
    // Månadsvis värden (för bättre läsbarhet)
    monthlyData.push({
      month: month,
      monthLabel: `Mån ${month}`,
      yearLabel: `År ${Math.ceil(month / 12)}`,
      // Månadsvis data
      intaktManad: monthlyRevenue,
      kostnadManad: monthlyCost,
      nettoManad: monthlyNet,
      // Kumulativa data  
      intaktKumulativ: cumulativeRevenue,
      kostnadKumulativ: cumulativeCosts,
      nettoKumulativ: cumulativeNet
    });
  }

  // Data för cirkeldiagram 1: Kostnadsfördelning
  const totalMonthlyCost = leasingCost + operatingCost.totalCost;
  const costDistributionData = [
    {
      name: 'Leasingkostnad',
      value: leasingCost,
      fill: '#3b82f6'
    },
    {
      name: 'Driftskostnad',
      value: operatingCost.totalCost,
      fill: '#10b981'
    }
  ];

  // Data för cirkeldiagram 2: Lönsamhet per månadsintäkt
  const profitabilityData = [
    {
      name: 'Nettoresultat',
      value: netResults.netPerMonthExVat,
      fill: '#059669'
    },
    {
      name: 'Totala kostnader',
      value: totalMonthlyCost,
      fill: '#dc2626'
    }
  ];

  // Konfiguration för charts
  const chartConfig = {
    intakt: {
      label: "Intäkt",
      color: "#10b981",
    },
    kostnad: {
      label: "Kostnad", 
      color: "#dc2626",
    },
    netto: {
      label: "Netto",
      color: "#3b82f6",
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <TrendingUp className="h-5 w-5" />
          📊 Visa Detaljerad Analys
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Detaljerad Finansiell Analys - {selectedMachine?.name || 'Vald maskin'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Huvudgraf - Förbättrad med bättre visualisering */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Ekonomisk Utveckling över 5 år - {selectedMachine?.name || 'Vald maskin'}
            </h3>
            
            {/* Månadsvis nyckelvärden för vald maskin */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-slate-600">Månatlig Intäkt</div>
                <div className="text-lg font-bold text-emerald-600">{formatCurrency(monthlyRevenue)}</div>
                <div className="text-xs text-slate-500">ex moms</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600">Månatlig Kostnad</div>
                <div className="text-lg font-bold text-red-600">{formatCurrency(monthlyCost)}</div>
                <div className="text-xs text-slate-500">ex moms</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600">Månatlig Netto</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(monthlyNet)}</div>
                <div className="text-xs text-slate-500">ex moms</div>
              </div>
            </div>

            <ChartContainer config={chartConfig} className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 11 }}
                    interval={11} // Visa varje 12:e månad (årtal)
                    tickFormatter={(value) => `År ${Math.ceil(value / 12)}`}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `${Math.round(value / 1000)}k kr`}
                  />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const monthNum = label as number;
                        const year = Math.ceil(monthNum / 12);
                        const monthInYear = ((monthNum - 1) % 12) + 1;
                        
                        return (
                          <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                            <p className="font-medium mb-2">
                              År {year}, Månad {monthInYear} (Månad {monthNum})
                            </p>
                            {payload.map((entry, index) => (
                              <div key={index} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-sm">{entry.name}</span>
                                </div>
                                <span className="font-medium">
                                  {formatCurrency(entry.value as number)}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="intaktKumulativ" 
                    stroke={chartConfig.intakt.color}
                    strokeWidth={3}
                    name="Kumulativ Intäkt"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="kostnadKumulativ" 
                    stroke={chartConfig.kostnad.color}
                    strokeWidth={3}
                    name="Kumulativ Kostnad"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="nettoKumulativ" 
                    stroke={chartConfig.netto.color}
                    strokeWidth={4}
                    name="Kumulativ Netto"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            {/* Graf-information */}
            <div className="mt-4 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-800 mb-1">📈 Grafvisualisering</p>
              <p>Denna graf visar den kumulativa ekonomiska utvecklingen över 5 år för <strong>{selectedMachine?.name || 'den valda maskinen'}</strong>. 
              Grafen uppdateras automatiskt när du byter maskin och återspeglar alla dina aktuella inställningar.</p>
            </div>
          </div>

          {/* KPI-Cirkeldiagram - Kompakt horisontell layout */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-emerald-600" />
              KPI-Översikt
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Cirkeldiagram 1: Kostnadsfördelning - Horisontell layout */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-blue-600" />
                  Månatlig Kostnadsfördelning
                </h3>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={45}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {costDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0];
                              return (
                                <div className="bg-white p-2 border border-slate-200 rounded shadow-lg">
                                  <p className="font-medium text-sm">{data.name}</p>
                                  <p className="text-xs text-slate-600">
                                    {formatCurrency(data.value as number)}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Leasing</span>
                      </div>
                      <span className="font-medium">{formatCurrency(leasingCost)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>Drift</span>
                      </div>
                      <span className="font-medium">{formatCurrency(operatingCost.totalCost)}</span>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(totalMonthlyCost)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cirkeldiagram 2: Lönsamhet per månadsintäkt - Horisontell layout */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Nettoandel av Månadsintäkt
                </h3>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={profitabilityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={45}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {profitabilityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0];
                              const totalRevenue = revenue.monthlyRevenueExVat;
                              return (
                                <div className="bg-white p-2 border border-slate-200 rounded shadow-lg">
                                  <p className="font-medium text-sm">{data.name}</p>
                                  <p className="text-xs text-slate-600">
                                    {formatCurrency(data.value as number)}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {((data.value as number / totalRevenue) * 100).toFixed(1)}% av intäkt
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <span>Netto</span>
                      </div>
                      <span className="font-medium text-emerald-600">{formatCurrency(netResults.netPerMonthExVat)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span>Kostnader</span>
                      </div>
                      <span className="font-medium">{formatCurrency(totalMonthlyCost)}</span>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>Intäkt</span>
                        <span>{formatCurrency(revenue.monthlyRevenueExVat)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ekonomisk Sammanfattning */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200 p-4">
            <h3 className="text-base font-semibold mb-3 text-slate-800">Ekonomisk Sammanfattning</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-xl font-bold text-emerald-600">
                  {((netResults.netPerMonthExVat / revenue.monthlyRevenueExVat) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-600">Vinstmarginal</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {Math.ceil(totalMonthlyCost / (revenue.monthlyRevenueExVat / 22))}
                </div>
                <div className="text-xs text-slate-600">Nollpunkt (dagar/mån)</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {formatCurrency(netResults.netPerYearExVat * 5)}
                </div>
                <div className="text-xs text-slate-600">5-års nettovinst</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedAnalysisModal;