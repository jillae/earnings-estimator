import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieChartIcon, ExternalLink, Download, AlertTriangle, Users, Target, Zap } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { useModalCalculations } from '@/hooks/useModalCalculations';
import GrowthMetrics from '../GrowthMetrics';
import ComparisonTable from '../ComparisonTable';
import { KlinikOptimeringSidebar } from '@/components/KlinikOptimeringSidebar';
import { machineData } from '@/data/machines';

const DetailedAnalysisContent: React.FC = () => {
  const { 
    leasingCost,
    operatingCost,
    selectedMachine,
    setSelectedMachineId
  } = useCalculator();

  const {
    modalTreatmentsPerDay,
    setModalTreatmentsPerDay,
    modalCustomerPrice,
    setModalCustomerPrice,
    modalRevenue,
    modalNetPerMonthExVat,
    modalNetPerYearExVat,
    totalMonthlyCost,
    monthlyData
  } = useModalCalculations();

  // Chart configuration
  const chartConfig = {
    revenue: {
      label: "Intäkt",
      color: "#10b981",
    },
    costs: {
      label: "Kostnader",
      color: "#ef4444",
    },
    profit: {
      label: "Vinst",
      color: "#3b82f6",
    },
  };

  // Beräkna nollpunkt (break-even punkt)
  const dailyRevenue = modalRevenue.monthlyRevenueExVat / 22; // 22 arbetsdagar per månad
  const breakEvenDays = dailyRevenue > 0 ? totalMonthlyCost / dailyRevenue : 0;

  return (
    <div className="space-y-6">
      {/* Interaktiva kontroller */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Anpassa Din Prognos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Behandlingar per dag */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Behandlingar per dag: {modalTreatmentsPerDay}</Label>
            <Slider
              value={[modalTreatmentsPerDay]}
              onValueChange={(value) => setModalTreatmentsPerDay(value[0])}
              max={30}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-slate-600">
              Nuvarande: {modalTreatmentsPerDay * 22} behandlingar/månad
            </div>
          </div>

          {/* Kundpris */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Kundpris per behandling: {formatCurrency(modalCustomerPrice, false)}</Label>
            <Slider
              value={[modalCustomerPrice]}
              onValueChange={(value) => setModalCustomerPrice(value[0])}
              max={3000}
              min={200}
              step={50}
              className="w-full"
            />
            <div className="text-xs text-slate-600">
              Månatlig potential: {formatCurrency(modalCustomerPrice * modalTreatmentsPerDay * 22)}
            </div>
          </div>
        </div>

        {/* Maskinval */}
        <div className="mt-4">
          <Label className="text-sm font-medium mb-2 block">Jämför med andra maskiner</Label>
          <Select value={selectedMachine?.id} onValueChange={setSelectedMachineId}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Välj maskin" />
            </SelectTrigger>
            <SelectContent>
              {machineData.map((machine) => (
                <SelectItem key={machine.id} value={machine.id}>
                  {machine.name} - {formatCurrency(machine.leasingMax || 0, false, true)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Huvudgraf - Fokus på klinikens tillväxt */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Din Kliniks Ekonomiska Utveckling över 5 år
            </h3>
            
            {/* Månadsvis nyckelvärden för kliniken */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-slate-600">Din Månatliga Intäkt</div>
                <div className="text-lg font-bold text-emerald-600">{formatCurrency(modalRevenue.monthlyRevenueExVat)}</div>
                <div className="text-xs text-slate-500">ex moms</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600">Dina Månatliga Kostnader</div>
                <div className="text-lg font-bold text-red-600">{formatCurrency(totalMonthlyCost)}</div>
                <div className="text-xs text-slate-500">ex moms</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600">Din Månatliga Netto</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(modalNetPerMonthExVat)}</div>
                <div className="text-xs text-slate-500">ex moms</div>
              </div>
            </div>

            {/* Flytande ruta för Nollpunkt */}
            <div className="sticky top-4 right-4 float-right bg-white rounded-lg shadow-lg border border-slate-200 p-4 z-10 mb-4 ml-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">
                    {breakEvenDays.toFixed(1)} dagar
                  </div>
                  <div className="text-sm text-slate-600">Nollpunkt</div>
                  <div className="text-xs text-slate-500">
                    Arbetsdagar per månad för att täcka kostnader
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <ChartContainer config={chartConfig} className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                      dataKey="revenue" 
                      stroke={chartConfig.revenue.color}
                      strokeWidth={3}
                      name="Intäkt"
                      dot={{ fill: chartConfig.revenue.color, strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="costs" 
                      stroke={chartConfig.costs.color}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Kostnader"
                      dot={{ fill: chartConfig.costs.color, strokeWidth: 2, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke={chartConfig.profit.color}
                      strokeWidth={3}
                      name="Vinst"
                      dot={{ fill: chartConfig.profit.color, strokeWidth: 2, r: 4 }}
                    />
                    <ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Tillväxtmetics */}
          <GrowthMetrics 
            monthlyRevenue={modalRevenue.monthlyRevenueExVat}
            monthlyNet={modalNetPerMonthExVat}
            totalMonthlyCost={totalMonthlyCost}
            treatmentsPerDay={modalTreatmentsPerDay}
            customerPrice={modalCustomerPrice}
          />
    </div>
  );
};

export default DetailedAnalysisContent;