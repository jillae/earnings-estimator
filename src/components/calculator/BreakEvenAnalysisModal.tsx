import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Target, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { useCalculator } from '@/context/CalculatorContext';

interface BreakEvenAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BreakEvenAnalysisModal: React.FC<BreakEvenAnalysisModalProps> = ({ open, onOpenChange }) => {
  const {
    operatingCost,
    revenue,
    customerPrice,
    treatmentsPerDay,
    workDaysPerMonth,
    selectedMachine
  } = useCalculator();

  // Beräkna dynamiska startvärden från kalkylatorn
  const [analysisData, setAnalysisData] = useState({
    fixedCosts: operatingCost.totalCost || 25000,
    variableCostPerTreatment: selectedMachine?.usesCredits ? (operatingCost.costPerMonth / (treatmentsPerDay * workDaysPerMonth) || 45) : 45,
    pricePerTreatment: customerPrice || 1200,
    workDaysPerMonth: workDaysPerMonth || 22,
    currentTreatmentsPerDay: treatmentsPerDay || 6,
    maxTreatmentsPerDay: 15
  });

  // Uppdatera värden när kalkylatorn ändras
  React.useEffect(() => {
    setAnalysisData(prev => ({
      ...prev,
      fixedCosts: operatingCost.totalCost || prev.fixedCosts,
      variableCostPerTreatment: selectedMachine?.usesCredits ? 
        (operatingCost.costPerMonth / (treatmentsPerDay * workDaysPerMonth) || prev.variableCostPerTreatment) : 
        prev.variableCostPerTreatment,
      pricePerTreatment: customerPrice || prev.pricePerTreatment,
      workDaysPerMonth: workDaysPerMonth || prev.workDaysPerMonth,
      currentTreatmentsPerDay: treatmentsPerDay || prev.currentTreatmentsPerDay,
    }));
  }, [operatingCost.totalCost, operatingCost.costPerMonth, customerPrice, treatmentsPerDay, workDaysPerMonth, selectedMachine]);

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
        isBreakEven: Math.abs(profit) < 1000,
        isProfit: profit > 0
      });
    }
    
    return data;
  };

  const chartData = createChartData();

  // Sensitivity analysis
  const sensitivityData = [
    { scenario: 'Pris -10%', breakEven: Math.round(analysisData.fixedCosts / ((analysisData.pricePerTreatment * 0.9) - analysisData.variableCostPerTreatment) / analysisData.workDaysPerMonth * 10) / 10 },
    { scenario: 'Nuvarande', breakEven: Math.round(breakEvenTreatmentsPerDay * 10) / 10 },
    { scenario: 'Pris +10%', breakEven: Math.round(analysisData.fixedCosts / ((analysisData.pricePerTreatment * 1.1) - analysisData.variableCostPerTreatment) / analysisData.workDaysPerMonth * 10) / 10 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Break-Even Analys</DialogTitle>
          <DialogDescription>
            Detaljerad break-even analys baserad på dina kalkylatorsettings
          </DialogDescription>
          {selectedMachine && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Baserat på {selectedMachine.name}
            </div>
          )}
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Kostnadsstruktur</CardTitle>
                <CardDescription>Justera för scenarioanalys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fixed">Fasta kostnader/månad (kr)</Label>
                  <Input
                    id="fixed"
                    type="number"
                    value={analysisData.fixedCosts}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev, 
                      fixedCosts: Number(e.target.value)
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="variable">Rörlig kostnad/behandling (kr)</Label>
                  <Input
                    id="variable"
                    type="number"
                    value={analysisData.variableCostPerTreatment}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev, 
                      variableCostPerTreatment: Number(e.target.value)
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Pris per behandling (kr)</Label>
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
                  <Label htmlFor="workdays">Arbetsdagar/månad</Label>
                  <Input
                    id="workdays"
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
                    onValueChange={(value) => setAnalysisData(prev => ({
                      ...prev, 
                      currentTreatmentsPerDay: value[0]
                    }))}
                    max={analysisData.maxTreatmentsPerDay}
                    step={1}
                    className="mt-2"
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
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Target className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                    <p className="text-lg font-bold text-orange-700">
                      {Math.round(breakEvenTreatmentsPerDay * 10) / 10}
                    </p>
                    <p className="text-xs text-orange-600">Behandlingar/dag för break-even</p>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-lg font-bold text-blue-700">
                      {formatCurrency(contributionMargin)}
                    </p>
                    <p className="text-xs text-blue-600">Täckningsgrad per behandling</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Nuvarande resultat:</span>
                    <span className={`font-bold ${currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(currentProfit)}/mån
                    </span>
                  </div>
                  
                  {currentProfit < 0 && (
                    <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-red-700">
                        <p className="font-medium">Under break-even</p>
                        <p>Behöver {Math.round((breakEvenTreatmentsPerDay - analysisData.currentTreatmentsPerDay) * 10) / 10} fler behandlingar/dag</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2 space-y-4">
            {/* Break-even Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Break-Even Analys</CardTitle>
                <CardDescription>
                  Intäkter vs kostnader vid olika volymer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
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
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        name="Intäkter"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalCosts" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        name="Totala kostnader"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Resultat"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sensitivity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Känslighetsanalys</CardTitle>
                <CardDescription>
                  Hur break-even påverkas av prisförändringar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sensitivityData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">{item.scenario}</span>
                      <span className="text-right">
                        <span className="font-bold">{item.breakEven}</span>
                        <span className="text-sm text-muted-foreground ml-1">behandlingar/dag</span>
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Insikter</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Täckningsgrad: {Math.round((contributionMargin / analysisData.pricePerTreatment) * 100)}% av priset</li>
                    <li>• En 10% prisökning minskar break-even med ~{Math.round((breakEvenTreatmentsPerDay - sensitivityData[2].breakEven) * 10) / 10} behandlingar/dag</li>
                    <li>• Månatlig break-even volym: {Math.round(breakEvenTreatmentsPerMonth)} behandlingar</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BreakEvenAnalysisModal;