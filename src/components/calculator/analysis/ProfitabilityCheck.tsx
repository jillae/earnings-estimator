import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CheckCircle, XCircle, TrendingUp, TrendingDown, Zap, Calculator } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { useModalCalculations } from '@/hooks/useModalCalculations';

const ProfitabilityCheck: React.FC = () => {
  const { 
    leasingCost,
    operatingCost,
    selectedMachine
  } = useCalculator();

  const {
    modalTreatmentsPerDay,
    setModalTreatmentsPerDay,
    modalCustomerPrice,
    setModalCustomerPrice,
    modalRevenue,
    modalNetPerMonthExVat,
    totalMonthlyCost,
    monthlyData
  } = useModalCalculations();

  const isProfitable = modalNetPerMonthExVat > 0;

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

  // Beräkna enkla "vad händer om"-scenarion
  const oneMoreTreatmentDaily = (modalTreatmentsPerDay + 1) * modalCustomerPrice * 22 * 0.8; // 22 arbetsdagar, 80% after VAT
  const priceIncrease100 = modalTreatmentsPerDay * (modalCustomerPrice + 100) * 22 * 0.8;
  const priceDecrease100 = modalTreatmentsPerDay * (modalCustomerPrice - 100) * 22 * 0.8;

  const additionalRevenueMoreTreatment = oneMoreTreatmentDaily - modalRevenue.monthlyRevenueExVat;
  const additionalRevenuePriceUp = priceIncrease100 - modalRevenue.monthlyRevenueExVat;
  const additionalRevenuePriceDown = priceDecrease100 - modalRevenue.monthlyRevenueExVat;

  return (
    <div className="space-y-6">
      {/* Stor profitabilitets-indikator */}
      <div className={`rounded-xl p-8 text-center ${
        isProfitable 
          ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200' 
          : 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200'
      }`}>
        <div className="flex items-center justify-center mb-4">
          {isProfitable ? (
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          ) : (
            <XCircle className="w-16 h-16 text-red-600" />
          )}
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${
          isProfitable ? 'text-emerald-800' : 'text-red-800'
        }`}>
          {isProfitable ? 'Ja, det här är lönsamt! 💰' : 'Inte lönsamt ännu 📊'}
        </h2>
        <p className={`text-base ${
          isProfitable ? 'text-emerald-700' : 'text-red-700'
        }`}>
          {isProfitable 
            ? 'Maskinen kommer att generera vinst för din klinik'
            : 'Justera inställningar för att göra investeringen lönsam'
          }
        </p>
      </div>

      {/* Enkel matematik i stora siffror */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-blue-600" />
          Enkel Matematik
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="text-sm text-blue-600 font-medium mb-2">Du betalar per månad:</div>
            <div className="text-3xl font-bold text-blue-800">
              {formatCurrency(totalMonthlyCost)}
            </div>
            <div className="text-sm text-blue-600 mt-1">
              Leasing + Drift
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-6">
            <div className="text-sm text-emerald-600 font-medium mb-2">Du tjänar per månad:</div>
            <div className="text-3xl font-bold text-emerald-800">
              {formatCurrency(modalRevenue.monthlyRevenueExVat)}
            </div>
            <div className="text-sm text-emerald-600 mt-1">
              {modalTreatmentsPerDay} behdl/dag × {formatCurrency(modalCustomerPrice, false)} × 22 dagar
            </div>
          </div>
          
          <div className={`rounded-lg p-6 ${
            isProfitable ? 'bg-purple-50' : 'bg-red-50'
          }`}>
            <div className={`text-sm font-medium mb-2 ${
              isProfitable ? 'text-purple-600' : 'text-red-600'
            }`}>
              Din vinst per månad:
            </div>
            <div className={`text-3xl font-bold ${
              isProfitable ? 'text-purple-800' : 'text-red-800'
            }`}>
              {formatCurrency(modalNetPerMonthExVat)}
            </div>
            <div className={`text-sm mt-1 ${
              isProfitable ? 'text-purple-600' : 'text-red-600'
            }`}>
              = {isProfitable ? 'Vinst!' : 'Förlust'}
            </div>
          </div>
        </div>
      </div>

      {/* Interaktiva kontroller */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Testa Olika Scenarion
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Behandlingar per dag */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Behandlingar per dag: <span className="text-blue-600 font-bold">{modalTreatmentsPerDay}</span>
            </Label>
            <Slider
              value={[modalTreatmentsPerDay]}
              onValueChange={(value) => setModalTreatmentsPerDay(value[0])}
              max={30}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-slate-600">
              = {modalTreatmentsPerDay * 22} behandlingar per månad
            </div>
          </div>

          {/* Kundpris */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Pris per behandling: <span className="text-emerald-600 font-bold">{formatCurrency(modalCustomerPrice, false)}</span>
            </Label>
            <Slider
              value={[modalCustomerPrice]}
              onValueChange={(value) => setModalCustomerPrice(value[0])}
              max={5000}
              min={500}
              step={100}
              className="w-full"
            />
            <div className="text-xs text-slate-600">
              Dagens standard: 1500-3500 kr
            </div>
          </div>
        </div>
      </div>

      {/* Interaktiv graf */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Se Utvecklingen över 5 År
        </h3>
        
        <div className="relative">
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData.filter((_, index) => index % 12 === 11)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="yearLabel" 
                  tick={{ fontSize: 11 }}
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
                  dot={{ fill: chartConfig.revenue.color, strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="costs" 
                  stroke={chartConfig.costs.color}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Kostnader"
                  dot={{ fill: chartConfig.costs.color, strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke={chartConfig.profit.color}
                  strokeWidth={3}
                  name="Vinst"
                  dot={{ fill: chartConfig.profit.color, strokeWidth: 2, r: 6 }}
                />
                <ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Enkla "vad händer om"-scenarion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">+1 Behandling/dag</h4>
          </div>
          <div className="text-sm text-blue-700 mb-2">
            Vad händer om du tar en behandling mer per dag?
          </div>
          <div className="text-xl font-bold text-blue-800">
            +{formatCurrency(additionalRevenueMoreTreatment * 12)}/år
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Extra intäkt per år
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h4 className="font-semibold text-emerald-900">+100 kr/behandling</h4>
          </div>
          <div className="text-sm text-emerald-700 mb-2">
            Vad händer om du höjer priset med 100 kr?
          </div>
          <div className="text-xl font-bold text-emerald-800">
            +{formatCurrency(additionalRevenuePriceUp * 12)}/år
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            Extra intäkt per år
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-orange-900">-100 kr/behandling</h4>
          </div>
          <div className="text-sm text-orange-700 mb-2">
            Vad händer om du sänker priset med 100 kr?
          </div>
          <div className="text-xl font-bold text-orange-800">
            {formatCurrency(additionalRevenuePriceDown * 12)}/år
          </div>
          <div className="text-xs text-orange-600 mt-1">
            Mindre intäkt per år
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityCheck;