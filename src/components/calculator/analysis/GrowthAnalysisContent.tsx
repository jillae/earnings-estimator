import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Target } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

const GrowthAnalysisContent: React.FC = () => {
  const { revenue, netResults, selectedMachine, treatmentsPerDay, customerPrice, workDaysPerMonth } = useCalculator();
  
  const [analysisSettings, setAnalysisSettings] = useState({
    timeHorizon: 60,
    baseRevenue: revenue?.monthlyRevenueExVat || 45000,
    confidenceInterval: true
  });

  // Realistisk tillväxtdata med gradvis ramp-up från 0
  const growthData = (() => {
    const data = [];
    
    for (let month = 0; month <= analysisSettings.timeHorizon; month++) {
      if (month === 0) {
        data.push({
          month: 0,
          conservative: 0,
          realistic: 0,
          optimistic: 0,
          year: 0
        });
        continue;
      }
      
      // Gradvis ramp-up första 6 månaderna
      const rampUpFactor = Math.min(1, month / 6);
      // Årlig tillväxt efter ramp-up perioden
      const growthMonths = Math.max(0, month - 6);
      const conservativeGrowth = Math.pow(1.01, growthMonths / 12); // 1% årlig
      const realisticGrowth = Math.pow(1.03, growthMonths / 12);     // 3% årlig  
      const optimisticGrowth = Math.pow(1.06, growthMonths / 12);    // 6% årlig
      
      data.push({
        month,
        conservative: Math.round(analysisSettings.baseRevenue * 0.8 * rampUpFactor * conservativeGrowth),
        realistic: Math.round(analysisSettings.baseRevenue * rampUpFactor * realisticGrowth),
        optimistic: Math.round(analysisSettings.baseRevenue * 1.2 * rampUpFactor * optimisticGrowth),
        year: Math.floor(month / 12)
      });
    }
    
    return data;
  })();

  // Nyckeltal för scenarion
  const keyMetrics = [
    {
      name: 'Konservativ',
      color: '#ef4444',
      finalRevenue: growthData[growthData.length - 1]?.conservative || 0,
      avgGrowthRate: 1,
      confidence: 85
    },
    {
      name: 'Realistisk', 
      color: '#3b82f6',
      finalRevenue: growthData[growthData.length - 1]?.realistic || 0,
      avgGrowthRate: 3,
      confidence: 70
    },
    {
      name: 'Optimistisk',
      color: '#22c55e', 
      finalRevenue: growthData[growthData.length - 1]?.optimistic || 0,
      avgGrowthRate: 6,
      confidence: 50
    }
  ];

  return (
    <div className="space-y-6">
      {/* Inställningar */}
      <Card>
        <CardHeader>
          <CardTitle>Analysparametrar</CardTitle>
          <CardDescription>
            Realistisk tillväxtprojektion med gradvis ramp-up från start
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="timeHorizon">Tidshorisont (månader)</Label>
            <Input
              id="timeHorizon"
              type="number"
              value={analysisSettings.timeHorizon}
              onChange={(e) => setAnalysisSettings(prev => ({
                ...prev,
                timeHorizon: Number(e.target.value)
              }))}
              min={12}
              max={120}
            />
          </div>
          <div>
            <Label htmlFor="baseRevenue">Basintäkt/månad (kr)</Label>
            <Input
              id="baseRevenue"
              type="number"
              value={analysisSettings.baseRevenue}
              onChange={(e) => setAnalysisSettings(prev => ({
                ...prev,
                baseRevenue: Number(e.target.value)
              }))}
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm">
              <p className="font-medium text-green-600">Synkroniserat</p>
              <p className="text-muted-foreground">Med kalkylator</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenarioöversikt */}
      <div className="grid grid-cols-3 gap-4">
        {keyMetrics.map((scenario, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium" style={{ color: scenario.color }}>
                  {scenario.name}
                </h4>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {scenario.confidence}% säkerhet
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Årlig tillväxt:</span>
                  <span className="font-bold">{scenario.avgGrowthRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slutintäkt:</span>
                  <span className="font-bold">{formatCurrency(scenario.finalRevenue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tillväxtgraf */}
      <Card>
        <CardHeader>
          <CardTitle>Intäktsutveckling med Realistisk Ramp-up</CardTitle>
          <CardDescription>
            Månadsintäkter med gradvis uppbyggnad från 0 första 6 månaderna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(value) => `År ${Math.floor(value/12)}`}
                />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: any, name) => [
                    formatCurrency(value), 
                    name === 'conservative' ? 'Konservativ (1%)' :
                    name === 'realistic' ? 'Realistisk (3%)' : 'Optimistisk (6%)'
                  ]}
                  labelFormatter={(label) => {
                    const years = Math.floor(Number(label) / 12);
                    const months = Number(label) % 12;
                    return `År ${years}, Månad ${months}`;
                  }}
                />
                
                <Line
                  type="monotone"
                  dataKey="conservative"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 4, fill: '#ef4444' }}
                />
                
                <Line
                  type="monotone"
                  dataKey="realistic"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4, fill: '#3b82f6' }}
                />
                
                <Line
                  type="monotone"
                  dataKey="optimistic"
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
            <p>• Alla scenarion börjar från 0 och bygger upp gradvis över 6 månader</p>
            <p>• Efter ramp-up perioden följer konstant årlig tillväxt</p>
            <p>• Konservativ och optimistisk visas som streckade linjer</p>
          </div>
        </CardContent>
      </Card>

      {/* Ramp-up förklaring */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Uppstartsfas (0-6 månader)</CardTitle>
            <CardDescription>Realistisk ramp-up period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>🚀 Månad 1-2</span>
                <span className="font-medium text-orange-600">0-30% kapacitet</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>📈 Månad 3-4</span>
                <span className="font-medium text-blue-600">30-70% kapacitet</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>🎯 Månad 5-6</span>
                <span className="font-medium text-green-600">70-100% kapacitet</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>💪 Månad 7+</span>
                <span className="font-medium text-green-600">100% + tillväxt</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tillväxtfaktorer</CardTitle>
            <CardDescription>Vad påverkar utvecklingen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>📍 Etablering & marknadsföring</span>
                <span className="text-muted-foreground">Månad 1-3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>👥 Kundbyggande & återbesök</span>
                <span className="text-muted-foreground">Månad 3-6</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>🔄 Återkommande kunder</span>
                <span className="text-muted-foreground">Månad 6+</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>📊 Optimering & expansion</span>
                <span className="text-muted-foreground">År 2+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrowthAnalysisContent;