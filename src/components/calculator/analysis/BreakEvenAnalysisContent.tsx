import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Target, TrendingUp, Calendar, AlertTriangle, Calculator } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

const BreakEvenAnalysisContent: React.FC = () => {
  const {
    operatingCost,
    revenue,
    customerPrice,
    treatmentsPerDay,
    workDaysPerMonth,
    selectedMachine
  } = useCalculator();

  const [analysisData, setAnalysisData] = useState({
    fixedCosts: operatingCost?.totalCost || 25000,
    variableCostPerTreatment: selectedMachine?.usesCredits ? 
      (operatingCost?.costPerMonth ? operatingCost.costPerMonth / (treatmentsPerDay * workDaysPerMonth) : 45) : 45,
    pricePerTreatment: customerPrice || 1200,
    workDaysPerMonth: workDaysPerMonth || 22,
    currentTreatmentsPerDay: treatmentsPerDay || 6,
    maxTreatmentsPerDay: 15
  });

  // Uppdatera när kalkylatorn ändras
  React.useEffect(() => {
    setAnalysisData(prev => ({
      ...prev,
      fixedCosts: operatingCost?.totalCost || prev.fixedCosts,
      variableCostPerTreatment: selectedMachine?.usesCredits ? 
        (operatingCost?.costPerMonth ? operatingCost.costPerMonth / (treatmentsPerDay * workDaysPerMonth) : prev.variableCostPerTreatment) : 
        prev.variableCostPerTreatment,
      pricePerTreatment: customerPrice || prev.pricePerTreatment,
      workDaysPerMonth: workDaysPerMonth || prev.workDaysPerMonth,
      currentTreatmentsPerDay: treatmentsPerDay || prev.currentTreatmentsPerDay,
    }));
  }, [operatingCost, customerPrice, treatmentsPerDay, workDaysPerMonth, selectedMachine]);

  // Break-even beräkningar
  const contributionMargin = analysisData.pricePerTreatment - analysisData.variableCostPerTreatment;
  const breakEvenTreatmentsPerMonth = analysisData.fixedCosts / contributionMargin;
  const breakEvenTreatmentsPerDay = breakEvenTreatmentsPerMonth / analysisData.workDaysPerMonth;
  
  const currentTreatmentsPerMonth = analysisData.currentTreatmentsPerDay * analysisData.workDaysPerMonth;
  const currentMonthlyRevenue = currentTreatmentsPerMonth * analysisData.pricePerTreatment;
  const currentVariableCosts = currentTreatmentsPerMonth * analysisData.variableCostPerTreatment;
  const currentProfit = currentMonthlyRevenue - currentVariableCosts - analysisData.fixedCosts;

  // Realistisk break-even utveckling över tid med gradvis ramp-up
  const generateBreakEvenProgress = () => {
    const targetTreatments = breakEvenTreatmentsPerDay;
    const currentTreatments = analysisData.currentTreatmentsPerDay;
    
    return Array.from({ length: 25 }, (_, month) => {
      if (month === 0) {
        return {
          month: 0,
          treatmentsPerDay: 0,
          profit: -analysisData.fixedCosts,
          achieved: false
        };
      }
      
      // Gradvis ramp-up första 6 månaderna
      const rampUpFactor = Math.min(1, month / 6);
      // Efter ramp-up, gradvis tillväxt mot mål
      const progressFactor = month > 6 ? 
        Math.min(1, 0.5 + ((month - 6) * 0.05)) : // 5% ökning per månad efter ramp-up
        rampUpFactor;
      
      const treatmentsPerDay = Math.min(
        currentTreatments * progressFactor,
        analysisData.maxTreatmentsPerDay
      );
      
      const monthlyTreatments = treatmentsPerDay * analysisData.workDaysPerMonth;
      const monthlyRevenue = monthlyTreatments * analysisData.pricePerTreatment;
      const monthlyVariableCosts = monthlyTreatments * analysisData.variableCostPerTreatment;
      const profit = monthlyRevenue - monthlyVariableCosts - analysisData.fixedCosts;
      
      return {
        month,
        treatmentsPerDay: Math.round(treatmentsPerDay * 10) / 10,
        profit: Math.round(profit),
        achieved: treatmentsPerDay >= targetTreatments
      };
    });
  };

  const progressData = generateBreakEvenProgress();
  const monthsToBreakEven = progressData.find(d => d.achieved)?.month || 24;

  // Känslighetsanalys
  const sensitivityScenarios = [
    { name: 'Pris -10%', priceMultiplier: 0.9, costMultiplier: 1.0 },
    { name: 'Pris -5%', priceMultiplier: 0.95, costMultiplier: 1.0 },
    { name: 'Nuvarande', priceMultiplier: 1.0, costMultiplier: 1.0 },
    { name: 'Kostnad +10%', priceMultiplier: 1.0, costMultiplier: 1.1 },
    { name: 'Pris +5%', priceMultiplier: 1.05, costMultiplier: 1.0 },
  ];

  const sensitivityData = sensitivityScenarios.map(scenario => {
    const adjustedPrice = analysisData.pricePerTreatment * scenario.priceMultiplier;
    const adjustedCost = analysisData.variableCostPerTreatment * scenario.costMultiplier;
    const margin = adjustedPrice - adjustedCost;
    const breakEven = analysisData.fixedCosts / margin;
    const breakEvenPerDay = breakEven / analysisData.workDaysPerMonth;
    
    return {
      ...scenario,
      breakEvenTreatments: Math.round(breakEven),
      breakEvenPerDay: Math.round(breakEvenPerDay * 10) / 10,
      margin: Math.round(margin)
    };
  });

  return (
    <div className="space-y-6">
      {/* Parametrar */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kostnadsstruktur</CardTitle>
            <CardDescription>
              Synkroniserat med kalkylatorn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fixedCosts">Fasta kostnader/månad (kr)</Label>
              <Input
                id="fixedCosts"
                type="number"
                value={analysisData.fixedCosts}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev, 
                  fixedCosts: Number(e.target.value)
                }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leasing, försäkring, SLA, lokalhyra
              </p>
            </div>

            <div>
              <Label htmlFor="variableCost">Rörlig kostnad/behandling (kr)</Label>
              <Input
                id="variableCost"
                type="number"
                value={analysisData.variableCostPerTreatment}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev, 
                  variableCostPerTreatment: Number(e.target.value)
                }))}
              />
            </div>

            <div>
              <Label htmlFor="price">Pris/behandling (kr)</Label>
              <Input
                id="price"
                type="number"
                value={analysisData.pricePerTreatment}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev, 
                  pricePerTreatment: Number(e.target.value)
                }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kapacitet & Volym</CardTitle>
            <CardDescription>
              Nuvarande och målvolymer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nuvarande behandlingar/dag: {analysisData.currentTreatmentsPerDay}</Label>
              <Slider
                value={[analysisData.currentTreatmentsPerDay]}
                onValueChange={([value]) => setAnalysisData(prev => ({
                  ...prev, 
                  currentTreatmentsPerDay: value
                }))}
                max={analysisData.maxTreatmentsPerDay}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="workDays">Arbetsdagar/månad</Label>
              <Input
                id="workDays"
                type="number"
                value={analysisData.workDaysPerMonth}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev, 
                  workDaysPerMonth: Number(e.target.value)
                }))}
              />
            </div>

            <div>
              <Label htmlFor="maxTreatments">Max kapacitet/dag</Label>
              <Input
                id="maxTreatments"
                type="number"
                value={analysisData.maxTreatmentsPerDay}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev, 
                  maxTreatmentsPerDay: Number(e.target.value)
                }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nyckeltal */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-600">Break-even</p>
                <p className="text-lg font-bold">{Math.ceil(breakEvenTreatmentsPerDay)}</p>
                <p className="text-xs text-muted-foreground">behandl/dag</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">Täckningsbidrag</p>
                <p className="text-lg font-bold">{formatCurrency(contributionMargin)}</p>
                <p className="text-xs text-muted-foreground">per behandling</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className={`h-5 w-5 ${currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className={`text-sm font-medium ${currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Nuvarande resultat
                </p>
                <p className="text-lg font-bold">{formatCurrency(currentProfit)}</p>
                <p className="text-xs text-muted-foreground">per månad</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-600">Till break-even</p>
                <p className="text-lg font-bold">
                  {monthsToBreakEven === 24 ? '24+' : `${monthsToBreakEven}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {monthsToBreakEven === 0 ? 'Lönsam nu' : 'månader'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Break-even utveckling */}
      <Card>
        <CardHeader>
          <CardTitle>Realistisk Väg till Break-Even</CardTitle>
          <CardDescription>
            Förväntad utveckling med gradvis ramp-up från 0
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(value) => `${value}m`}
                />
                <YAxis 
                  yAxisId="treatments"
                  orientation="left"
                  tickFormatter={(value) => `${value}/dag`} 
                />
                <YAxis 
                  yAxisId="profit"
                  orientation="right"
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  formatter={(value: any, name) => [
                    name === 'treatmentsPerDay' ? `${value}/dag` : formatCurrency(value), 
                    name === 'treatmentsPerDay' ? 'Behandlingar per dag' : 'Månatligt resultat'
                  ]}
                  labelFormatter={(label) => `Månad ${label}`}
                />
                
                {/* Break-even linje för behandlingar */}
                <ReferenceLine
                  yAxisId="treatments"
                  y={breakEvenTreatmentsPerDay}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
                
                {/* Break-even linje för vinst */}
                <ReferenceLine
                  yAxisId="profit"
                  y={0}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
                
                {/* Ramp-up markering */}
                <ReferenceLine
                  x={6}
                  stroke="#fbbf24"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                />
                
                {/* Behandlingsvolym */}
                <Line
                  yAxisId="treatments"
                  type="monotone"
                  dataKey="treatmentsPerDay"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#3b82f6' }}
                />
                
                {/* Resultat */}
                <Line
                  yAxisId="profit"
                  type="monotone"
                  dataKey="profit"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 4, fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>• Blå linje: Utveckling av behandlingsvolym (vänster skala)</p>
            <p>• Grön streckad linje: Månatligt resultat (höger skala)</p>
            <p>• Röda linjer: Break-even nivåer</p>
            <p>• Gul linje: Slutet av ramp-up period (månad 6)</p>
          </div>
        </CardContent>
      </Card>

      {/* Känslighetsanalys */}
      <Card>
        <CardHeader>
          <CardTitle>Känslighetsanalys</CardTitle>
          <CardDescription>
            Hur förändringar påverkar break-even
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sensitivityData.map((scenario, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  scenario.name === 'Nuvarande' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div>
                  <h4 className="font-medium">{scenario.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Täckningsbidrag: {formatCurrency(scenario.margin)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{scenario.breakEvenPerDay}/dag</p>
                  <p className="text-sm text-muted-foreground">
                    {scenario.breakEvenTreatments}/månad
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentProfit < 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  För att nå break-even behöver du öka från {analysisData.currentTreatmentsPerDay} till{' '}
                  {Math.ceil(breakEvenTreatmentsPerDay)} behandlingar per dag.
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Med gradvis ramp-up från 0 och realistisk tillväxt tar det ca {monthsToBreakEven} månader.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BreakEvenAnalysisContent;