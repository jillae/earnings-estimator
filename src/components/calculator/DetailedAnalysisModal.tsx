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

  // Data för huvudgrafen - månadsvis utveckling över 5 år
  const monthlyData = [];
  for (let month = 1; month <= 60; month++) {
    const cumulativeRevenue = revenue.monthlyRevenueExVat * month;
    const cumulativeCosts = (leasingCost + operatingCost.totalCost) * month;
    const cumulativeNet = cumulativeRevenue - cumulativeCosts;
    
    monthlyData.push({
      month: `Mån ${month}`,
      intakt: cumulativeRevenue,
      kostnad: cumulativeCosts,
      netto: cumulativeNet
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
          variant="outline" 
          className="gap-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
        >
          <TrendingUp className="h-4 w-4" />
          Detaljerad Analys
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
          {/* Huvudgraf */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Kumulativ utveckling över 5 år
            </h3>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value) => formatCurrency(value as number)}
                    />}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="intakt" 
                    stroke={chartConfig.intakt.color}
                    strokeWidth={2}
                    name="Intäkt"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="kostnad" 
                    stroke={chartConfig.kostnad.color}
                    strokeWidth={2}
                    name="Kostnad"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="netto" 
                    stroke={chartConfig.netto.color}
                    strokeWidth={3}
                    name="Netto"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* KPI Cirkeldiagram */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cirkeldiagram 1: Kostnadsfördelning */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-blue-600" />
                Månatlig Kostnadsfördelning
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
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
                            <div className="bg-white p-3 border border-slate-200 rounded shadow-lg">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-slate-600">
                                {formatCurrency(data.value as number)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {((data.value as number / totalMonthlyCost) * 100).toFixed(1)}% av total
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
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Leasingkostnad</span>
                  </div>
                  <span className="font-medium">{formatCurrency(leasingCost)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span>Driftskostnad</span>
                  </div>
                  <span className="font-medium">{formatCurrency(operatingCost.totalCost)}</span>
                </div>
              </div>
            </div>

            {/* Cirkeldiagram 2: Lönsamhet per månadsintäkt */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Nettoandel av Månadsintäkt
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profitabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
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
                            <div className="bg-white p-3 border border-slate-200 rounded shadow-lg">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-slate-600">
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
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                    <span>Nettoresultat</span>
                  </div>
                  <span className="font-medium text-emerald-600">{formatCurrency(netResults.netPerMonthExVat)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span>Totala kostnader</span>
                  </div>
                  <span className="font-medium">{formatCurrency(totalMonthlyCost)}</span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Total månadsintäkt</span>
                    <span>{formatCurrency(revenue.monthlyRevenueExVat)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sammanfattning */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Sammanfattning</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {((netResults.netPerMonthExVat / revenue.monthlyRevenueExVat) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-slate-600">Vinstmarginal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.ceil(totalMonthlyCost / (revenue.monthlyRevenueExVat / 22))}
                </div>
                <div className="text-sm text-slate-600">Nollpunkt (dagar/mån)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(netResults.netPerYearExVat * 5)}
                </div>
                <div className="text-sm text-slate-600">5-års nettovinst</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedAnalysisModal;