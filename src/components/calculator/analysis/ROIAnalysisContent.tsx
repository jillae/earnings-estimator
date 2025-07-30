import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { useCalculator } from '@/context/CalculatorContext';

const ROIAnalysisContent: React.FC = () => {
  const {
    selectedMachine,
    machinePriceSEK,
    cashPriceSEK,
    paymentOption,
    revenue,
    operatingCost,
    leasingCost
  } = useCalculator();

  // Beräkna dynamiska startvärden från kalkylatorn
  const getInitialInvestment = () => {
    if (paymentOption === 'cash') {
      return cashPriceSEK || 250000;
    }
    return (leasingCost * 12) || 120000;
  };

  const [analysisData, setAnalysisData] = useState({
    initialInvestment: getInitialInvestment(),
    monthlyRevenue: revenue.monthlyRevenueExVat || 0,
    monthlyCosts: operatingCost.totalCost || 0,
    timeHorizon: 60,
    growthRate: 2
  });

  // Uppdatera värden när kalkylatorn ändras
  React.useEffect(() => {
    setAnalysisData(prev => ({
      ...prev,
      initialInvestment: getInitialInvestment(),
      monthlyRevenue: revenue.monthlyRevenueExVat || prev.monthlyRevenue,
      monthlyCosts: operatingCost.totalCost || prev.monthlyCosts,
    }));
  }, [paymentOption, cashPriceSEK, leasingCost, revenue.monthlyRevenueExVat, operatingCost.totalCost]);

  // Beräkna ROI data
  const calculateROIData = () => {
    const data = [];
    let cumulativeProfit = -analysisData.initialInvestment;
    let monthlyNet = analysisData.monthlyRevenue - analysisData.monthlyCosts;
    
    for (let month = 0; month <= analysisData.timeHorizon; month++) {
      const growthFactor = Math.pow(1 + (analysisData.growthRate / 100), month / 12);
      const adjustedNet = monthlyNet * growthFactor;
      
      if (month > 0) {
        cumulativeProfit += adjustedNet;
      }
      
      const roi = analysisData.initialInvestment > 0 ? 
        ((cumulativeProfit + analysisData.initialInvestment) / analysisData.initialInvestment) * 100 : 0;
      
      data.push({
        month,
        cumulativeProfit: Math.round(cumulativeProfit),
        monthlyNet: Math.round(adjustedNet),
        roi: Math.round(roi * 10) / 10,
        breakEven: cumulativeProfit >= 0
      });
    }
    
    return data;
  };

  const roiData = calculateROIData();
  const breakEvenMonth = roiData.find(d => d.breakEven)?.month || analysisData.timeHorizon;
  const finalROI = roiData[roiData.length - 1]?.roi || 0;
  const totalProfit = roiData[roiData.length - 1]?.cumulativeProfit || 0;

  // Scenario analys
  const scenarios = [
    {
      name: 'Pessimistisk',
      growth: analysisData.growthRate - 1,
      revenue: analysisData.monthlyRevenue * 0.8,
      color: '#ef4444'
    },
    {
      name: 'Realistisk', 
      growth: analysisData.growthRate,
      revenue: analysisData.monthlyRevenue,
      color: '#3b82f6'
    },
    {
      name: 'Optimistisk',
      growth: analysisData.growthRate + 2,
      revenue: analysisData.monthlyRevenue * 1.2,
      color: '#22c55e'
    }
  ];

  const scenarioData = scenarios.map(scenario => {
    let cumulativeProfit = -analysisData.initialInvestment;
    let monthlyNet = scenario.revenue - analysisData.monthlyCosts;
    
    for (let month = 1; month <= analysisData.timeHorizon; month++) {
      const growthFactor = Math.pow(1 + (scenario.growth / 100), month / 12);
      cumulativeProfit += monthlyNet * growthFactor;
    }
    
    return {
      ...scenario,
      finalProfit: Math.round(cumulativeProfit),
      roi: Math.round(((cumulativeProfit + analysisData.initialInvestment) / analysisData.initialInvestment) * 100)
    };
  });

  // Kontrollera om vi använder fallback-värden
  const usingFallbackData = !selectedMachine || revenue.monthlyRevenueExVat === 0 || operatingCost.totalCost === 0;

  return (
    <div className="space-y-6">
      {/* Varning om saknad data */}
      {usingFallbackData && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Ingen data att analysera</h3>
          <p className="text-red-700 mb-4">
            För att göra en ROI-analys behöver du först göra en beräkning i kalkylatorn.
          </p>
          <p className="text-sm text-red-600 mb-4">
            Vi visar inga exempelvärden för att undvika missförstånd.
          </p>
          <a 
            href="/" 
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Gå till Kalkylatorn
          </a>
        </div>
      )}

      {/* Visa analysen endast om vi har data */}
      {!usingFallbackData && (
      <div className="grid lg:grid-cols-3 gap-6">
      {/* Input Panel */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Analysparametrar</CardTitle>
            <CardDescription>Justera för scenarioanalys</CardDescription>
            {selectedMachine && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Baserat på {selectedMachine.name} ({paymentOption === 'cash' ? 'Kontant' : 'Leasing'})
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="investment">Initial investering (kr)</Label>
              <Input
                id="investment"
                type="number"
                value={analysisData.initialInvestment}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev, 
                  initialInvestment: Number(e.target.value)
                }))}
              />
            </div>

            <div>
              <Label htmlFor="revenue">Månatlig intäkt (kr)</Label>
              <Input
                id="revenue"
                type="number"
                value={analysisData.monthlyRevenue}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev, 
                  monthlyRevenue: Number(e.target.value)
                }))}
              />
            </div>

            <div>
              <Label htmlFor="costs">Månatlig kostnad (kr)</Label>
              <Input
                id="costs"
                type="number"
                value={analysisData.monthlyCosts}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev, 
                  monthlyCosts: Number(e.target.value)
                }))}
              />
            </div>

            <div>
              <Label htmlFor="timeHorizon">Tidshorisont</Label>
              <Select 
                value={analysisData.timeHorizon.toString()}
                onValueChange={(value) => setAnalysisData(prev => ({
                  ...prev, 
                  timeHorizon: Number(value)
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">2 år</SelectItem>
                  <SelectItem value="36">3 år</SelectItem>
                  <SelectItem value="48">4 år</SelectItem>
                  <SelectItem value="60">5 år</SelectItem>
                  <SelectItem value="84">7 år</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="growth">Årlig tillväxt (%)</Label>
              <Input
                id="growth"
                type="number"
                step="0.5"
                value={analysisData.growthRate}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev, 
                  growthRate: Number(e.target.value)
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Nyckeltal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <Calendar className="h-5 w-5 mx-auto mb-1 text-red-600" />
                <p className="text-xl font-bold text-red-700">{breakEvenMonth}</p>
                <p className="text-xs text-red-600">Månader till break-even</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <p className="text-xl font-bold text-green-700">{finalROI}%</p>
                <p className="text-xs text-green-600">Total ROI</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total vinst:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(totalProfit)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      <div className="lg:col-span-2 space-y-4">
        {/* ROI Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Kumulativ Lönsamhet</CardTitle>
            <CardDescription>
              Utveckling av ackumulerad vinst över tid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => `${value}m`}
                  />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: any, name) => [
                      formatCurrency(value), 
                      name === 'cumulativeProfit' ? 'Ackumulerad vinst' : 'ROI'
                    ]}
                    labelFormatter={(label) => `Månad ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cumulativeProfit" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={() => 0}
                    stroke="#ef4444" 
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Scenarioanalys</CardTitle>
            <CardDescription>
              Jämförelse av olika tillväxtscenarier efter {analysisData.timeHorizon} månader
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: any, name) => [
                      name === 'finalProfit' ? formatCurrency(value) : `${value}%`,
                      name === 'finalProfit' ? 'Total vinst' : 'ROI'
                    ]}
                  />
                  <Bar 
                    dataKey="finalProfit" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {scenarioData.map((scenario, index) => (
                <div key={index} className="text-center p-3 border rounded-lg">
                  <h4 className="font-medium mb-2" style={{ color: scenario.color }}>
                    {scenario.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-1">
                    ROI: <span className="font-bold">{scenario.roi}%</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tillväxt: <span className="font-bold">{scenario.growth}%/år</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      )}
    </div>
  );
};

export default ROIAnalysisContent;