import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import GrowthMetrics from './GrowthMetrics';
import ComparisonTable from './ComparisonTable';
import { KlinikOptimeringSidebar } from '@/components/KlinikOptimeringSidebar';
import { machineData } from '@/data/machines';

const DetailedAnalysisModal: React.FC = () => {
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

  // Beräkna nollpunkt (break-even punkt)
  const dailyRevenue = modalRevenue.monthlyRevenueExVat / 22; // 22 arbetsdagar per månad
  const breakEvenDays = dailyRevenue > 0 ? totalMonthlyCost / dailyRevenue : 0;

  // Funktioner för att hantera export och nytt fönster
  const handleOpenInNewWindow = () => {
    const newWindow = window.open('', '_blank', 'width=1200,height=800');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Tillväxtprognos - ${selectedMachine?.name || 'Vald maskin'}</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .disclaimer { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Tillväxtprognos för Din Klinik - ${selectedMachine?.name || 'Vald maskin'}</h1>
              <h2>Dina Ekonomiska Nyckeltal</h2>
              <p><strong>Din månatliga intäkt:</strong> ${formatCurrency(modalRevenue.monthlyRevenueExVat)} (ex moms)</p>
              <p><strong>Dina månatliga kostnader:</strong> ${formatCurrency(totalMonthlyCost)} (ex moms)</p>
              <p><strong>Din månatliga netto:</strong> ${formatCurrency(modalNetPerMonthExVat)} (ex moms)</p>
              <p><strong>Din vinstmarginal:</strong> ${((modalNetPerMonthExVat / modalRevenue.monthlyRevenueExVat) * 100).toFixed(1)}%</p>
              <p><strong>Din 5-års nettovinst:</strong> ${formatCurrency(modalNetPerYearExVat * 5)}</p>
              <p><strong>Behandlingar per dag:</strong> ${modalTreatmentsPerDay}</p>
              <p><strong>Kundpris per behandling:</strong> ${formatCurrency(modalCustomerPrice)} (ink moms)</p>
            </div>
            <div class="disclaimer">
              <strong>⚠️ Viktig information:</strong> Dessa beräkningar är prognoser baserade på dina inmatade värden. 
              Verifiera alltid siffrorna själv och förlita dig inte blint på automatiska beräkningar för viktiga affärsbeslut.
              Faktiska resultat kan variera beroende på marknadsutveckling, valutakurser och andra faktorer.
            </div>
          </body>
        </html>
      `);
    }
  };

  const handleSaveChart = () => {
    window.print();
  };

  // Data för cirkeldiagram 1: Kostnadsfördelning
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
      name: 'Din nettoresultat',
      value: modalNetPerMonthExVat,
      fill: '#059669'
    },
    {
      name: 'Dina totala kostnader',
      value: totalMonthlyCost,
      fill: '#dc2626'
    }
  ];

  // Konfiguration för charts
  const chartConfig = {
    intakt: {
      label: "Din Intäkt",
      color: "#10b981",
    },
    kostnad: {
      label: "Dina Kostnader", 
      color: "#dc2626",
    },
    netto: {
      label: "Din Netto",
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
          📈 Tillväxtprognos för Din Klinik
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Interaktiv Tillväxtprognos - {selectedMachine?.name || 'Vald maskin'}
            </div>
            {/* Export-knappar i header */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenInNewWindow}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Nytt fönster
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSaveChart}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Skriv ut
              </Button>
            </div>
          </DialogTitle>
          
          {/* Maskinväljare */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <Zap className="h-5 w-5 text-primary" />
            <Label htmlFor="machine-selector" className="text-sm font-medium">
              Välj maskin för analys:
            </Label>
            <Select
              value={selectedMachine?.id || ''}
              onValueChange={(value) => setSelectedMachineId(value)}
            >
              <SelectTrigger className="w-64 bg-white">
                <SelectValue placeholder="Välj maskin..." />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {machineData.map((machine) => (
                  <SelectItem key={machine.id} value={machine.id} className="hover:bg-slate-100">
                    <span>{machine.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="graph" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="graph">📈 Grafisk Översikt</TabsTrigger>
            <TabsTrigger value="table">📊 Tabellöversikt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="graph" className="space-y-6">
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

              {/* Flytande ruta för Nollpunkt - STICKY */}
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
                        dataKey="intaktKumulativ" 
                        stroke={chartConfig.intakt.color}
                        strokeWidth={3}
                        name="Din Kumulativa Intäkt"
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="kostnadKumulativ" 
                        stroke={chartConfig.kostnad.color}
                        strokeWidth={3}
                        name="Dina Kumulativa Kostnader"
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="nettoKumulativ" 
                        stroke={chartConfig.netto.color}
                        strokeWidth={4}
                        name="Din Kumulativa Netto"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      {/* Nollpunkt - horisontell linje vid y=0 utan text */}
                      <ReferenceLine 
                        y={0} 
                        stroke="#64748b" 
                        strokeWidth={2} 
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              {/* Prognos-verktyg: Interaktiva Sliderns - DIREKT UNDER GRAFEN */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Prognos-verktyg - Testa Din Kliniks Potential
                </h4>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Antal behandlingar per dag */}
                  <div className="space-y-2">
                    <Label htmlFor="modal-treatments" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Antal behandlingar per dag
                    </Label>
                    <Slider
                      id="modal-treatments"
                      min={1}
                      max={20}
                      step={1}
                      value={[modalTreatmentsPerDay]}
                      onValueChange={(value) => setModalTreatmentsPerDay(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>1</span>
                      <span className="font-semibold text-blue-600">{modalTreatmentsPerDay} beh/dag</span>
                      <span>20</span>
                    </div>
                  </div>

                  {/* Kundpris per behandling */}
                  <div className="space-y-2">
                    <Label htmlFor="modal-price" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Kundpris per behandling (ink moms)
                    </Label>
                    <Slider
                      id="modal-price"
                      min={500}
                      max={10000}
                      step={100}
                      value={[modalCustomerPrice]}
                      onValueChange={(value) => setModalCustomerPrice(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>500 kr</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(modalCustomerPrice)}</span>
                      <span>10 000 kr</span>
                    </div>
                  </div>
                </div>
                
                {/* Snabb resultat-förhandsvisning */}
                <div className="grid grid-cols-2 gap-3 mt-4 p-3 bg-white rounded border border-slate-200">
                  <div className="text-center">
                    <div className="text-xs text-slate-600">Månadsintäkt</div>
                    <div className="text-lg font-bold text-emerald-600">{formatCurrency(modalRevenue.monthlyRevenueExVat)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-600">Månadsnetto</div>
                    <div className="text-lg font-bold text-blue-600">{formatCurrency(modalNetPerMonthExVat)}</div>
                  </div>
                </div>
              </div>
              
              {/* Graf-information */}
              <div className="mt-4 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-800 mb-1">📈 Tillväxtprognos</p>
                <p>Denna graf visar hur din kliniks ekonomi kan utvecklas över 5 år med <strong>{selectedMachine?.name || 'den valda maskinen'}</strong>. 
                Justera behandlingar per dag och kundpris ovan för att se olika scenarier!</p>
              </div>
            </div>

            {/* KlinikOptimering Reklam - Strategiskt placerad efter huvudgrafen */}
            <div className="border border-primary/20 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 p-1">
              <KlinikOptimeringSidebar />
            </div>

            {/* Nyckeltal för Tillväxt */}
            <GrowthMetrics
              monthlyRevenue={modalRevenue.monthlyRevenueExVat}
              monthlyNet={modalNetPerMonthExVat}
              totalMonthlyCost={totalMonthlyCost}
              treatmentsPerDay={modalTreatmentsPerDay}
              customerPrice={modalCustomerPrice}
            />

            {/* KPI-Cirkeldiagram - Fokus på klinikens ekonomi */}
            <div className="border-t border-slate-200 pt-4">
              <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-emerald-600" />
                Din Ekonomiska Översikt
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Cirkeldiagram 1: Kostnadsfördelning */}
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-blue-600" />
                    Dina Månatliga Kostnader
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
                          <span>Totalt</span>
                          <span>{formatCurrency(totalMonthlyCost)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cirkeldiagram 2: Lönsamhet per månadsintäkt */}
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    Din Lönsamhetsfördelning
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
                                const totalRevenue = modalRevenue.monthlyRevenueExVat;
                                return (
                                  <div className="bg-white p-2 border border-slate-200 rounded shadow-lg">
                                    <p className="font-medium text-sm">{data.name}</p>
                                    <p className="text-xs text-slate-600">
                                      {formatCurrency(data.value as number)}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {((data.value as number / totalRevenue) * 100).toFixed(1)}% av din intäkt
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
                          <span>Din netto</span>
                        </div>
                        <span className="font-medium text-emerald-600">{formatCurrency(modalNetPerMonthExVat)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                          <span>Dina kostnader</span>
                        </div>
                        <span className="font-medium">{formatCurrency(totalMonthlyCost)}</span>
                      </div>
                      <div className="pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between text-sm font-medium">
                          <span>Din intäkt</span>
                          <span>{formatCurrency(modalRevenue.monthlyRevenueExVat)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="table" className="space-y-6">
            <ComparisonTable />
          </TabsContent>
          
          {/* Disclaimer - Flyttad till botten med professionell text */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">⚠️ Ansvarsfriskrivning</p>
                <p>Dessa prognoser är baserade på dina inmatade värden och nuvarande marknadsförhållanden. Verifiera alltid siffrorna själv och förlita dig inte blint på automatiska beräkningar för viktiga affärsbeslut. Faktiska resultat kan variera beroende på marknadsutveckling, valutakurser och andra faktorer.</p>
              </div>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedAnalysisModal;