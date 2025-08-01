import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { TrendingUp, Target, DollarSign } from 'lucide-react';

const BusinessMetricsSection: React.FC = () => {
  const { netResults, revenue, leasingCost, operatingCost, selectedMachine, treatmentsPerDay, customerPrice } = useCalculator();
  
  const monthlyNet = netResults?.netPerMonthExVat || 0;
  const yearlyNet = netResults?.netPerYearExVat || 0;
  const monthlyRevenue = revenue?.monthlyRevenueExVat || 0;
  const totalMonthlyCost = (leasingCost || 0) + (operatingCost?.totalCost || 0);
  
  // Tillväxtprognos data (5 år)
  const growthData = Array.from({ length: 60 }, (_, i) => {
    const month = i + 1;
    const yearFactor = Math.floor(i / 12) + 1;
    const growthRate = 1 + (0.03 * yearFactor); // 3% årlig tillväxt per år
    return {
      month,
      year: `År ${yearFactor}`,
      revenue: monthlyRevenue * growthRate,
      profit: monthlyNet * growthRate,
      cumulative: monthlyNet * growthRate * month
    };
  });

  // ROI över tid
  const machinePrice = selectedMachine?.priceEur ? selectedMachine.priceEur * 11.5 : 500000;
  const roiData = Array.from({ length: 36 }, (_, i) => {
    const month = i + 1;
    const totalProfit = monthlyNet * month;
    const roi = ((totalProfit / machinePrice) * 100);
    return {
      month,
      roi: Math.max(roi, -100), // Begränsa till -100% för grafens skull
      breakeven: 0
    };
  });

  // What-if scenarios
  const scenarios = [
    { name: 'Konservativ', treatments: Math.max(1, treatmentsPerDay - 2), price: customerPrice * 0.9 },
    { name: 'Nuvarande', treatments: treatmentsPerDay, price: customerPrice },
    { name: 'Optimistisk', treatments: treatmentsPerDay + 2, price: customerPrice * 1.1 }
  ].map(scenario => {
    const dailyRevenue = scenario.treatments * scenario.price * 1.25; // 25% moms
    const monthlyRev = dailyRevenue * 22; // 22 arbetsdagar
    const monthlyProfit = (monthlyRev / 1.25) - totalMonthlyCost; // Exkl moms
    return {
      ...scenario,
      monthlyProfit,
      yearlyProfit: monthlyProfit * 12
    };
  });

  const COLORS = ['#ef4444', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Affärsinsikter</h3>
        <p className="text-slate-600">Djupare analys av din investering över tid</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tillväxtprognos */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600 mr-2" />
            <h4 className="font-semibold text-slate-900">Tillväxtprognos</h4>
          </div>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData.slice(0, 36)}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10 }}
                  interval={5}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-slate-600">
            <p>3-årig projektion med 3% årlig tillväxt</p>
            <p className="font-medium text-emerald-600 mt-1">
              År 3: {formatCurrency(growthData[35]?.profit || 0)}/mån
            </p>
          </div>
        </Card>

        {/* ROI utveckling */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-slate-900">ROI Utveckling</h4>
          </div>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10 }}
                  interval={5}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="roi"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="breakeven"
                  stroke="#e2e8f0"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-slate-600">
            <p>Return on Investment över 3 år</p>
            <p className="font-medium text-blue-600 mt-1">
              År 3: {((yearlyNet * 3 / machinePrice) * 100).toFixed(0)}% ROI
            </p>
          </div>
        </Card>

        {/* What-if scenarios */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
            <h4 className="font-semibold text-slate-900">Scenarioanalys</h4>
          </div>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scenarios}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Bar dataKey="yearlyProfit" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-sm">
            {scenarios.map((scenario, index) => (
              <div key={scenario.name} className="flex justify-between">
                <span className={`font-medium ${index === 1 ? 'text-blue-600' : 'text-slate-600'}`}>
                  {scenario.name}:
                </span>
                <span className={`${scenario.yearlyProfit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(scenario.yearlyProfit)}
                </span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Sammanfattning */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <h4 className="font-semibold text-slate-900 mb-2">Sammanfattning</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-bold text-blue-600">{formatCurrency(monthlyNet)}</div>
              <div className="text-slate-600">Månadsinkomst</div>
            </div>
            <div>
              <div className="font-bold text-emerald-600">{formatCurrency(yearlyNet)}</div>
              <div className="text-slate-600">Årsinkomst</div>
            </div>
            <div>
              <div className="font-bold text-purple-600">
                {monthlyNet > 0 ? Math.ceil(machinePrice / monthlyNet) : 'N/A'} mån
              </div>
              <div className="text-slate-600">Återbetalningstid</div>
            </div>
            <div>
              <div className="font-bold text-orange-600">
                {((yearlyNet / machinePrice) * 100).toFixed(0)}%
              </div>
              <div className="text-slate-600">Årlig ROI</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BusinessMetricsSection;