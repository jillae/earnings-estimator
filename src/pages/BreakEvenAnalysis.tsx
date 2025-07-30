import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Target, TrendingUp, Calendar, AlertTriangle, ArrowLeft, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/utils/formatUtils';

const BreakEvenAnalysis = () => {
  const [analysisData, setAnalysisData] = useState({
    fixedCosts: 25000, // Månadsleasing + försäkring + SLA
    variableCostPerTreatment: 45, // Kostnad per behandling (consumables etc)
    pricePerTreatment: 1200, // Pris per behandling
    workDaysPerMonth: 22,
    currentTreatmentsPerDay: 6,
    maxTreatmentsPerDay: 15 // Kapacitet
  });

  // Beräkna break-even punkt
  const contributionMargin = analysisData.pricePerTreatment - analysisData.variableCostPerTreatment;
  const breakEvenTreatmentsPerMonth = analysisData.fixedCosts / contributionMargin;
  const breakEvenTreatmentsPerDay = breakEvenTreatmentsPerMonth / analysisData.workDaysPerMonth;
  
  const currentTreatmentsPerMonth = analysisData.currentTreatmentsPerDay * analysisData.workDaysPerMonth;
  const currentMonthlyRevenue = currentTreatmentsPerMonth * analysisData.pricePerTreatment;
  const currentVariableCosts = currentTreatmentsPerMonth * analysisData.variableCostPerTreatment;
  const currentProfit = currentMonthlyRevenue - currentVariableCosts - analysisData.fixedCosts;

  // Skapa data för grafen
  const createChartData = () => {
    const data = [];
    const maxTreatments = analysisData.maxTreatmentsPerDay * analysisData.workDaysPerMonth;
    
    for (let treatments = 0; treatments <= maxTreatments; treatments += 10) {
      const revenue = treatments * analysisData.pricePerTreatment;
      const variableCosts = treatments * analysisData.variableCostPerTreatment;
      const totalCosts = variableCosts + analysisData.fixedCosts;
      const profit = revenue - totalCosts;
      const treatmentsPerDay = treatments / analysisData.workDaysPerMonth;
      
      data.push({
        treatments,
        treatmentsPerDay: Math.round(treatmentsPerDay * 10) / 10,
        revenue,
        totalCosts,
        profit,
        breakEven: profit >= 0
      });
    }
    
    return data;
  };

  const chartData = createChartData();

  // Känslighetsanalys
  const sensitivityAnalysis = () => {
    const scenarios = [
      { name: 'Pris -10%', price: analysisData.pricePerTreatment * 0.9, variableCost: analysisData.variableCostPerTreatment },
      { name: 'Pris -5%', price: analysisData.pricePerTreatment * 0.95, variableCost: analysisData.variableCostPerTreatment },
      { name: 'Nuvarande', price: analysisData.pricePerTreatment, variableCost: analysisData.variableCostPerTreatment },
      { name: 'Pris +5%', price: analysisData.pricePerTreatment * 1.05, variableCost: analysisData.variableCostPerTreatment },
      { name: 'Pris +10%', price: analysisData.pricePerTreatment * 1.1, variableCost: analysisData.variableCostPerTreatment },
    ];

    return scenarios.map(scenario => {
      const margin = scenario.price - scenario.variableCost;
      const breakEven = analysisData.fixedCosts / margin;
      const breakEvenPerDay = breakEven / analysisData.workDaysPerMonth;
      
      return {
        ...scenario,
        breakEvenTreatments: Math.round(breakEven),
        breakEvenPerDay: Math.round(breakEvenPerDay * 10) / 10,
        margin: Math.round(margin)
      };
    });
  };

  const sensitivityData = sensitivityAnalysis();

  // Tid till break-even om man ökar från nuvarande nivå
  const timeToBreakEven = () => {
    if (currentTreatmentsPerMonth >= breakEvenTreatmentsPerMonth) {
      return 0; // Redan över break-even
    }
    
    // Antag 10% ökning per månad i behandlingar
    const growthRate = 0.1;
    let treatments = currentTreatmentsPerMonth;
    let months = 0;
    
    while (treatments < breakEvenTreatmentsPerMonth && months < 24) {
      treatments *= (1 + growthRate);
      months++;
    }
    
    return months;
  };

  const monthsToBreakEven = timeToBreakEven();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka till Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Break-even Analys</h1>
          <p className="text-muted-foreground">
            Beräkna hur många behandlingar som krävs för att nå lönsamhet
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Kostnadsstruktur</CardTitle>
                <CardDescription>Justera dina kostnader och priser</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Förbrukningsmaterial, el, etc.
                  </p>
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

          {/* Analysis Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
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
                        {monthsToBreakEven === 0 ? '✓' : `${monthsToBreakEven}m`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {monthsToBreakEven === 0 ? 'Lönsam nu' : 'med 10% tillväxt'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Break-even Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Break-even Analys</CardTitle>
                <CardDescription>
                  Intäkter vs kostnader vid olika behandlingsvolymer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="treatmentsPerDay" 
                        tickFormatter={(value) => `${value}/dag`}
                      />
                      <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value: any, name) => [
                          formatCurrency(value), 
                          name === 'revenue' ? 'Intäkter' : 
                          name === 'totalCosts' ? 'Totala kostnader' : 'Resultat'
                        ]}
                        labelFormatter={(label) => `${label} behandlingar/dag`}
                      />
                      
                      {/* Intäkter */}
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#22c55e" 
                        fill="#22c55e"
                        fillOpacity={0.2}
                      />
                      
                      {/* Kostnader */}
                      <Area 
                        type="monotone" 
                        dataKey="totalCosts" 
                        stroke="#ef4444" 
                        fill="#ef4444"
                        fillOpacity={0.2}
                      />
                      
                      {/* Break-even punkt */}
                      <Line 
                        type="monotone" 
                        dataKey={() => 0}
                        stroke="#6b7280" 
                        strokeDasharray="2 2"
                        strokeWidth={1}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {currentProfit < 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Du behöver öka från {analysisData.currentTreatmentsPerDay} till{' '}
                          {Math.ceil(breakEvenTreatmentsPerDay)} behandlingar per dag för att nå break-even.
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Det motsvarar en ökning på{' '}
                          {Math.round(((breakEvenTreatmentsPerDay / analysisData.currentTreatmentsPerDay - 1) * 100))}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sensitivity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Känslighetsanalys</CardTitle>
                <CardDescription>
                  Hur prisförändringar påverkar break-even punkten
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
                          Pris: {formatCurrency(scenario.price)} | Täckningsbidrag: {formatCurrency(scenario.margin)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{scenario.breakEvenPerDay} behandl/dag</p>
                        <p className="text-sm text-muted-foreground">
                          {scenario.breakEvenTreatments} behandl/månad
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BreakEvenAnalysis;