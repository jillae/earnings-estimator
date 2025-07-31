import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, Calendar, Users, Zap, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { useCalculator } from '@/context/CalculatorContext';

const GrowthAnalysisContent: React.FC = () => {
  const {
    selectedMachine,
    revenue,
    netResults,
    treatmentsPerDay,
    customerPrice,
    operatingCost,
    workDaysPerMonth
  } = useCalculator();

  // Tillväxtparametrar
  const [growthScenario, setGrowthScenario] = useState('realistic');
  const [timeHorizon, setTimeHorizon] = useState(36); // månader
  const [targetTreatmentsPerDay, setTargetTreatmentsPerDay] = useState([Math.min(treatmentsPerDay * 2, 15)]);
  const [marketPenetration, setMarketPenetration] = useState([75]); // procent

  // Tillväxtscenarier
  const growthScenarios = {
    conservative: { monthly: 0.02, description: '2% månadsvis tillväxt' },
    realistic: { monthly: 0.05, description: '5% månadsvis tillväxt' },
    aggressive: { monthly: 0.08, description: '8% månadsvis tillväxt' }
  };

  const currentScenario = growthScenarios[growthScenario as keyof typeof growthScenarios];

  // Beräkna tillväxtprognos
  const generateGrowthData = () => {
    const data = [];
    const currentMonthlyRevenue = revenue?.monthlyRevenueExVat || 0;
    const currentMonthlyNet = netResults?.netPerMonthExVat || 0;
    
    for (let month = 0; month <= timeHorizon; month++) {
      const growthFactor = Math.pow(1 + currentScenario.monthly, month);
      const adjustedTreatments = Math.min(
        treatmentsPerDay * growthFactor,
        targetTreatmentsPerDay[0]
      );
      
      const monthlyRevenue = adjustedTreatments * customerPrice * workDaysPerMonth;
      const monthlyNet = monthlyRevenue - operatingCost.totalCost;
      const cumulativeNet = monthlyNet * month;
      
      // Kapacitetsutnyttjande
      const capacityUtilization = Math.min((adjustedTreatments / 16) * 100, 100); // 16 = max per dag
      
      data.push({
        month,
        monthlyRevenue: Math.round(monthlyRevenue),
        monthlyNet: Math.round(monthlyNet),
        cumulativeNet: Math.round(cumulativeNet),
        treatmentsPerDay: Math.round(adjustedTreatments * 10) / 10,
        capacityUtilization: Math.round(capacityUtilization)
      });
    }
    
    return data;
  };

  const growthData = generateGrowthData();
  const finalData = growthData[growthData.length - 1];

  // Milstolpar
  const milestones = [
    {
      month: 6,
      description: 'Etablerad kundbas',
      target: 'Break-even uppnått'
    },
    {
      month: 12,
      description: 'Stabil tillväxt',
      target: '50% kapacitet'
    },
    {
      month: 24,
      description: 'Marknadsposition',
      target: '75% kapacitet'
    },
    {
      month: 36,
      description: 'Full kapacitet',
      target: 'Expansion möjlig'
    }
  ];

  // Riskfaktorer och möjligheter
  const riskFactors = [
    'Konkurrens från nya aktörer',
    'Förändrade kundpreferenser',
    'Regulatoriska ändringar',
    'Ekonomisk nedgång'
  ];

  const opportunities = [
    'Utöka behandlingsutbud',
    'Partnerships med vårdcentraler',
    'Digital marknadsföring',
    'Prenumerationstjänster'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Interaktiv Tillväxtprognos</h3>
        <p className="text-slate-600">
          Modellera din kliniks tillväxt med {selectedMachine?.name || 'den valda maskinen'}
        </p>
      </div>

      {/* Kontroller */}
      <div className="grid lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <Label className="text-sm font-medium mb-2 block">Tillväxtscenario</Label>
          <Select value={growthScenario} onValueChange={setGrowthScenario}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Konservativ (2%/mån)</SelectItem>
              <SelectItem value="realistic">Realistisk (5%/mån)</SelectItem>
              <SelectItem value="aggressive">Aggressiv (8%/mån)</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4">
          <Label className="text-sm font-medium mb-2 block">Tidshorisontt</Label>
          <Select value={timeHorizon.toString()} onValueChange={(value) => setTimeHorizon(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">1 år</SelectItem>
              <SelectItem value="24">2 år</SelectItem>
              <SelectItem value="36">3 år</SelectItem>
              <SelectItem value="60">5 år</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4">
          <Label className="text-sm font-medium mb-2 block">
            Mål: {targetTreatmentsPerDay[0]} behandl/dag
          </Label>
          <Slider
            value={targetTreatmentsPerDay}
            onValueChange={setTargetTreatmentsPerDay}
            max={16}
            min={treatmentsPerDay}
            step={0.5}
            className="mt-2"
          />
        </Card>

        <Card className="p-4">
          <Label className="text-sm font-medium mb-2 block">
            Marknadspenetration: {marketPenetration[0]}%
          </Label>
          <Slider
            value={marketPenetration}
            onValueChange={setMarketPenetration}
            max={100}
            min={25}
            step={5}
            className="mt-2"
          />
        </Card>
      </div>

      {/* Huvudgraf */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Tillväxtprognos - {currentScenario.description}
          </CardTitle>
          <CardDescription>
            Månatlig intäkt och netto över {timeHorizon} månader
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(value) => `Mån ${value}`}
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    formatCurrency(Number(value)), 
                    name === 'monthlyRevenue' ? 'Månatlig intäkt' : 'Månatligt netto'
                  ]}
                  labelFormatter={(month) => `Månad ${month}`}
                />
                <Area
                  type="monotone"
                  dataKey="monthlyRevenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="monthlyNet"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#netGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* KPI-kort */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-900">Total Intäkt</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700">
              {formatCurrency(finalData?.cumulativeNet || 0)}
            </div>
            <p className="text-xs text-emerald-600 mt-1">
              Under {timeHorizon} månader
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Behandlingar/dag</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {finalData?.treatmentsPerDay || 0}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Från {treatmentsPerDay} idag
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Kapacitet</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {finalData?.capacityUtilization || 0}%
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Av maxkapacitet
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">ROI-tid</span>
            </div>
            <div className="text-2xl font-bold text-orange-700">
              {Math.round(timeHorizon / 3)} mån
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Uppskattat break-even
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Milstolpar och Strategi */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Tillväxtmilstolpar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">{milestone.month}m</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">{milestone.description}</div>
                  <div className="text-sm text-slate-600">{milestone.target}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Strategiska Insikter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h5 className="font-medium text-green-900 mb-2">🚀 Möjligheter</h5>
              <ul className="space-y-1">
                {opportunities.map((opportunity, index) => (
                  <li key={index} className="text-sm text-green-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-3 border-t">
              <h5 className="font-medium text-orange-900 mb-2">⚠️ Riskfaktorer</h5>
              <ul className="space-y-1">
                {riskFactors.map((risk, index) => (
                  <li key={index} className="text-sm text-orange-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrowthAnalysisContent;