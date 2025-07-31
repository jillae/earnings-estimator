import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, TrendingUp, Calendar, AlertTriangle, Target, Zap } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { useCalculator } from '@/context/CalculatorContext';

const ROIAnalysisContent: React.FC = () => {
  const {
    selectedMachine,
    machinePriceSEK,
    cashPriceSEK,
    revenue,
    netResults,
    operatingCost,
    leasingCost,
    paymentOption,
    treatmentsPerDay,
    customerPrice
  } = useCalculator();

  // ROI-parametrar
  const [analysisYears, setAnalysisYears] = useState(5);
  const [initialInvestment, setInitialInvestment] = useState(
    paymentOption === 'cash' ? (cashPriceSEK || 0) : 0
  );
  const [monthlyOperatingCost, setMonthlyOperatingCost] = useState(
    operatingCost.totalCost || 0
  );

  // Dynamiskt uppdatera värden från kalkylatorn
  React.useEffect(() => {
    setInitialInvestment(paymentOption === 'cash' ? (cashPriceSEK || 0) : 0);
    setMonthlyOperatingCost(operatingCost.totalCost || 0);
  }, [paymentOption, cashPriceSEK, operatingCost.totalCost]);

  // Beräkna ROI-data
  const generateROIData = () => {
    const data = [];
    const monthlyRevenue = revenue?.monthlyRevenueExVat || 0;
    const monthlyNet = netResults?.netPerMonthExVat || 0;
    
    let cumulativeInvestment = initialInvestment;
    let cumulativeProfit = -initialInvestment; // Börja med negativt för initial investering
    
    for (let month = 0; month <= analysisYears * 12; month++) {
      // För leasing lägg till månadskostnad som del av investering
      if (paymentOption === 'leasing' && month > 0) {
        cumulativeInvestment += leasingCost || 0;
      }
      
      // Lägg till månatligt netto (minus operativa kostnader redan räknade)
      if (month > 0) {
        cumulativeProfit += monthlyNet;
      }
      
      // Beräkna ROI
      const roi = cumulativeInvestment > 0 ? 
        ((cumulativeProfit + cumulativeInvestment) / cumulativeInvestment) * 100 : 0;
      
      // Payback period (månader till break-even)
      const isPaybackAchieved = cumulativeProfit >= 0;
      
      data.push({
        month,
        year: Math.floor(month / 12),
        cumulativeInvestment: Math.round(cumulativeInvestment),
        cumulativeProfit: Math.round(cumulativeProfit),
        monthlyNet: Math.round(monthlyNet),
        roi: Math.round(roi * 10) / 10,
        isPaybackAchieved
      });
    }
    
    return data;
  };

  const roiData = generateROIData();
  
  // Hitta payback period
  const paybackMonth = roiData.find(d => d.cumulativeProfit >= 0)?.month || analysisYears * 12;
  const paybackYears = Math.floor(paybackMonth / 12);
  const paybackMonths = paybackMonth % 12;
  
  // Slutlig ROI
  const finalROI = roiData[roiData.length - 1]?.roi || 0;
  const finalProfit = roiData[roiData.length - 1]?.cumulativeProfit || 0;
  
  // Månadsvis data för trendanalys
  const monthlyTrendData = roiData.filter((_, index) => index % 3 === 0); // Var tredje månad

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">ROI-analys</h3>
        <p className="text-slate-600">
          Avkastning på investering för {selectedMachine?.name || 'den valda maskinen'}
        </p>
      </div>

      {/* Snabba KPI:er */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">ROI ({analysisYears} år)</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {finalROI.toFixed(1)}%
            </div>
            <p className="text-xs text-green-600 mt-1">
              Total avkastning
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Payback-tid</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {paybackYears}.{paybackMonths}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              År till break-even
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Total Vinst</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {(finalProfit / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-purple-600 mt-1">
              SEK efter {analysisYears} år
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Månatligt</span>
            </div>
            <div className="text-2xl font-bold text-orange-700">
              {((netResults?.netPerMonthExVat || 0) / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Netto per månad
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ROI-graf */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            ROI-utveckling över tid
          </CardTitle>
          <CardDescription>
            Kumulativ avkastning och vinst över {analysisYears} år
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="year" 
                  tickFormatter={(value) => `År ${value}`}
                />
                <YAxis 
                  yAxisId="roi"
                  orientation="left"
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  yAxisId="profit"
                  orientation="right"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'roi') {
                      return [`${Number(value).toFixed(1)}%`, 'ROI'];
                    } else {
                      return [formatCurrency(Number(value)), 'Kumulativ Vinst'];
                    }
                  }}
                  labelFormatter={(year) => `År ${year}`}
                />
                <Line
                  yAxisId="roi"
                  type="monotone"
                  dataKey="roi"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                />
                <Line
                  yAxisId="profit"
                  type="monotone"
                  dataKey="cumulativeProfit"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Parametrar och Scenarioanalys */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Investeringsparametrar</CardTitle>
            <CardDescription>Justera värden för mer exakt analys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="analysisYears">Analysperiod (år)</Label>
              <Input
                id="analysisYears"
                type="number"
                value={analysisYears}
                onChange={(e) => setAnalysisYears(Number(e.target.value))}
                min="1"
                max="10"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="initialInvestment">Initial investering</Label>
              <Input
                id="initialInvestment"
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                className="mt-1"
                disabled={paymentOption === 'leasing'}
              />
              {paymentOption === 'leasing' && (
                <p className="text-xs text-slate-500 mt-1">
                  Beräknas automatiskt för leasing
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="monthlyOperating">Månatlig driftskostnad</Label>
              <Input
                id="monthlyOperating"
                type="number"
                value={monthlyOperatingCost}
                onChange={(e) => setMonthlyOperatingCost(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              ROI-optimering
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-medium text-green-900 mb-2">🚀 Förbättringsmöjligheter</h5>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                  <span>Öka behandlingar/dag med 1 → +{formatCurrency((customerPrice * 22) || 0)}/mån</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                  <span>Höj pris med 10% → +{formatCurrency(((revenue?.monthlyRevenueExVat || 0) * 0.1))}/mån</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                  <span>Optimera kostnader → Förbättrad ROI</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">📊 Branschbenchmark</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Branschsnitt ROI:</span>
                  <span className="font-medium">15-25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Din ROI:</span>
                  <span className={`font-medium ${finalROI > 20 ? 'text-green-600' : 'text-orange-600'}`}>
                    {finalROI.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Payback tid (snitt):</span>
                  <span className="font-medium">2-3 år</span>
                </div>
              </div>
            </div>

            {finalROI < 15 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-orange-900 mb-1">Optimering rekommenderad</h5>
                    <p className="text-sm text-orange-700">
                      ROI under branschsnitt. Överväg att justera priser eller öka volym.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ROIAnalysisContent;