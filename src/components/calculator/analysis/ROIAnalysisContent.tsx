import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Target } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

const ROIAnalysisContent: React.FC = () => {
  const {
    selectedMachine,
    machinePriceSEK,
    cashPriceSEK,
    paymentOption,
    revenue,
    operatingCost,
    netResults,
    leasingCost
  } = useCalculator();

  // Beräkna initial investering
  const getInitialInvestment = () => {
    if (paymentOption === 'cash') {
      return cashPriceSEK || 250000;
    }
    return (leasingCost * 12) || 120000;
  };

  const [analysisData, setAnalysisData] = useState({
    initialInvestment: getInitialInvestment(),
    monthlyRevenue: revenue?.monthlyRevenueExVat || 45000,
    monthlyCosts: operatingCost?.totalCost || 15000,
    timeHorizon: 60,
    growthRate: 3
  });

  // Uppdatera när kalkylatorn ändras
  React.useEffect(() => {
    setAnalysisData(prev => ({
      ...prev,
      initialInvestment: getInitialInvestment(),
      monthlyRevenue: revenue?.monthlyRevenueExVat || prev.monthlyRevenue,
      monthlyCosts: operatingCost?.totalCost || prev.monthlyCosts,
    }));
  }, [paymentOption, cashPriceSEK, leasingCost, revenue?.monthlyRevenueExVat, operatingCost?.totalCost]);

  // Realistisk ROI-data med gradvis ramp-up från 0
  const generateROIData = () => {
    const netMonthly = analysisData.monthlyRevenue - analysisData.monthlyCosts;
    let cumulativeProfit = -analysisData.initialInvestment;
    
    return Array.from({ length: analysisData.timeHorizon + 1 }, (_, month) => {
      if (month === 0) {
        return {
          month: 0,
          cumulativeProfit: -analysisData.initialInvestment,
          monthlyNet: 0,
          roi: -100,
          breakEven: false
        };
      }
      
      // Gradvis ramp-up första 6 månaderna
      const rampUpFactor = Math.min(1, month / 6);
      // Tillväxt efter ramp-up perioden
      const growthMonths = Math.max(0, month - 6);
      const growthFactor = Math.pow(1 + (analysisData.growthRate / 100), growthMonths / 12);
      
      const currentNet = netMonthly * rampUpFactor * growthFactor;
      cumulativeProfit += currentNet;
      
      const roi = analysisData.initialInvestment > 0 ? 
        ((cumulativeProfit + analysisData.initialInvestment) / analysisData.initialInvestment) * 100 : 0;
      
      return {
        month,
        cumulativeProfit: Math.round(cumulativeProfit),
        monthlyNet: Math.round(currentNet),
        roi: Math.round(roi * 10) / 10,
        breakEven: cumulativeProfit >= 0
      };
    });
  };

  const roiData = generateROIData();
  const breakEvenMonth = roiData.find(d => d.breakEven)?.month || analysisData.timeHorizon;
  const finalROI = roiData[roiData.length - 1]?.roi || 0;
  const totalProfit = roiData[roiData.length - 1]?.cumulativeProfit || 0;

  return (
    <div className="space-y-6">
      {/* Parametrar */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Investeringsparametrar</CardTitle>
            <CardDescription>
              Synkroniserat med kalkylatorn
            </CardDescription>
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
              <p className="text-xs text-muted-foreground mt-1">
                {paymentOption === 'cash' ? 'Kontantpris' : 'Första årets leasingkostnader'}
              </p>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysparametrar</CardTitle>
            <CardDescription>
              Tidshorisont och tillväxtförväntningar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="growth">Tillväxt efter ramp-up (%/år)</Label>
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
              <p className="text-xs text-muted-foreground mt-1">
                Tillväxt tillämpas efter 6 månaders ramp-up period
              </p>
            </div>

            {selectedMachine && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">
                    {selectedMachine.name}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Nyckeltal */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-5 w-5 mx-auto mb-2 text-red-600" />
            <p className="text-2xl font-bold text-red-700">
              {breakEvenMonth === analysisData.timeHorizon ? '60+' : breakEvenMonth}
            </p>
            <p className="text-xs text-muted-foreground">Månader till break-even</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-700">{finalROI}%</p>
            <p className="text-xs text-muted-foreground">Total ROI</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-5 w-5 mx-auto mb-2 text-blue-600" />
            <p className="text-lg font-bold text-blue-700">{formatCurrency(totalProfit)}</p>
            <p className="text-xs text-muted-foreground">Total vinst</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 mx-auto mb-2 text-purple-600" />
            <p className="text-lg font-bold text-purple-700">6 mån</p>
            <p className="text-xs text-muted-foreground">Ramp-up period</p>
          </CardContent>
        </Card>
      </div>

      {/* ROI-graf */}
      <Card>
        <CardHeader>
          <CardTitle>Kumulativ Lönsamhetsutveckling</CardTitle>
          <CardDescription>
            ROI-utveckling med realistisk ramp-up från 0 första 6 månaderna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(value) => `År ${Math.floor(value/12)}`}
                />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: any, name) => [
                    formatCurrency(value), 
                    'Ackumulerad vinst'
                  ]}
                  labelFormatter={(label) => {
                    const years = Math.floor(Number(label) / 12);
                    const months = Number(label) % 12;
                    return `År ${years}, Månad ${months}`;
                  }}
                />
                
                {/* Break-even linje */}
                <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} />
                
                {/* Ramp-up markering */}
                <ReferenceLine x={6} stroke="#fbbf24" strokeDasharray="3 3" strokeWidth={1} />
                
                {/* Huvudlinje */}
                <Line 
                  type="monotone" 
                  dataKey="cumulativeProfit" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>• Röd streckad linje: Break-even (0 kr ackumulerad vinst)</p>
            <p>• Gul streckad linje: Slutet av ramp-up period (månad 6)</p>
            <p>• Kurvan startar från initial investering som negativ vinst</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ROIAnalysisContent;