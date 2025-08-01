import React from 'react';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Calendar, Target, Wallet, Clock, ArrowUp } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { useModalCalculations } from '@/hooks/useModalCalculations';

const SimplifiedTimeAnalysis: React.FC = () => {
  const { 
    leasingCost,
    operatingCost,
    selectedMachine
  } = useCalculator();

  const {
    modalRevenue,
    modalNetPerMonthExVat,
    modalNetPerYearExVat,
    totalMonthlyCost,
    monthlyData
  } = useModalCalculations();

  // Beräkna nyckeltal i vardagsspråk
  const profitAfter1Year = modalNetPerMonthExVat * 12;
  const profitAfter3Years = modalNetPerMonthExVat * 36;
  
  // Beräkna återbetalningstid (baserat på när vi täckt leasingkostnaden)
  const dailyRevenue = modalRevenue.monthlyRevenueExVat / 22; // 22 arbetsdagar per månad
  const paybackDays = dailyRevenue > 0 ? totalMonthlyCost / dailyRevenue : 0;
  const paybackMonths = paybackDays / 22;

  // Chart configuration
  const chartConfig = {
    cumulativeProfit: {
      label: "Ackumulerad Vinst",
      color: "#3b82f6",
    },
  };

  // Skapa data för ackumulerad vinst över tid
  const cumulativeProfitData = monthlyData.map((item, index) => ({
    month: item.month,
    cumulativeProfit: modalNetPerMonthExVat * (index + 1),
    year: Math.ceil(item.month / 12)
  }));

  // Enkla tillväxtscenarier
  const conservativeGrowth = modalNetPerMonthExVat * 12 * 1.05; // 5% tillväxt per år
  const optimisticGrowth = modalNetPerMonthExVat * 12 * 1.15; // 15% tillväxt per år

  return (
    <div className="space-y-6">
      {/* 3 stora nyckeltal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-800 mb-2">
            {formatCurrency(profitAfter1Year)}
          </div>
          <div className="text-lg font-semibold text-blue-700">Efter 1 År</div>
          <div className="text-sm text-blue-600 mt-2">
            Total vinst första året
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-800 mb-2">
            {formatCurrency(profitAfter3Years)}
          </div>
          <div className="text-lg font-semibold text-emerald-700">Efter 3 År</div>
          <div className="text-sm text-emerald-600 mt-2">
            Total vinst på tre år
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-800 mb-2">
            {paybackMonths.toFixed(1)} mån
          </div>
          <div className="text-lg font-semibold text-purple-700">Återbetalningstid</div>
          <div className="text-sm text-purple-600 mt-2">
            När maskinen betalar sig själv
          </div>
        </div>
      </div>

      {/* Enkel vinst-över-tid graf */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Wallet className="h-6 w-6 text-blue-600" />
          Din Ackumulerade Vinst över Tid
        </h3>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700 mb-2">
            <strong>Så här läser du grafen:</strong>
          </div>
          <div className="text-sm text-blue-600 space-y-1">
            <div>• Linjen visar hur mycket total vinst du samlat på dig</div>
            <div>• Varje månad läggs {formatCurrency(modalNetPerMonthExVat)} till</div>
            <div>• Efter {paybackMonths.toFixed(1)} månader har maskinen betalat sig själv</div>
          </div>
        </div>
        
        <div className="relative">
          <ChartContainer config={chartConfig} className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeProfitData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11 }}
                  interval={11}
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
                            År {year}, Månad {monthInYear}
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full bg-blue-500"
                              />
                              <span className="text-sm">Total vinst hittills</span>
                            </div>
                            <span className="font-medium">
                              {formatCurrency(payload[0]?.value as number)}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeProfit" 
                  stroke={chartConfig.cumulativeProfit.color}
                  strokeWidth={4}
                  name="Ackumulerad Vinst"
                  dot={{ fill: chartConfig.cumulativeProfit.color, strokeWidth: 2, r: 5 }}
                />
                <ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Enkla tillväxtscenarier */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowUp className="h-5 w-5 text-slate-600" />
          Vad Händer om Din Klinik Växer?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h4 className="font-semibold text-slate-900">Försiktig Tillväxt (5% per år)</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">År 1:</span>
                <span className="font-medium">{formatCurrency(profitAfter1Year)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">År 2:</span>
                <span className="font-medium">{formatCurrency(conservativeGrowth)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">År 3:</span>
                <span className="font-medium">{formatCurrency(conservativeGrowth * 1.05)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Total efter 3 år:</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(profitAfter1Year + conservativeGrowth + (conservativeGrowth * 1.05))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <h4 className="font-semibold text-emerald-900">Optimistisk Tillväxt (15% per år)</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-emerald-700">År 1:</span>
                <span className="font-medium">{formatCurrency(profitAfter1Year)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">År 2:</span>
                <span className="font-medium">{formatCurrency(optimisticGrowth)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">År 3:</span>
                <span className="font-medium">{formatCurrency(optimisticGrowth * 1.15)}</span>
              </div>
              <div className="pt-2 border-t border-emerald-200">
                <div className="flex justify-between">
                  <span className="text-emerald-700 font-medium">Total efter 3 år:</span>
                  <span className="font-bold text-emerald-900">
                    {formatCurrency(profitAfter1Year + optimisticGrowth + (optimisticGrowth * 1.15))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">
            <strong>Tips för tillväxt:</strong> Fler behandlingar per dag eller högre priser ger snabbt resultat. 
            Med bara en extra behandling per dag ökar din månadsvinst med cirka {formatCurrency((modalRevenue.monthlyRevenueExVat / 22) * 22 * 0.8 - modalRevenue.monthlyRevenueExVat)}.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedTimeAnalysis;