import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Target, ArrowLeft, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/utils/formatUtils';
import { useCalculator } from '@/context/CalculatorContext';

const GrowthForecast = () => {
  const {
    selectedMachine,
    revenue,
    netResults,
    treatmentsPerDay,
    customerPrice,
    workDaysPerMonth
  } = useCalculator();

  // State för prognosparametrar
  const [forecastData, setForecastData] = useState({
    currentMonthlyRevenue: revenue.monthlyRevenueExVat || 50000,
    currentTreatmentsPerDay: treatmentsPerDay || 6,
    pricePerTreatment: customerPrice || 1200,
    workDaysPerMonth: workDaysPerMonth || 22,
    
    // Prognosparametrar
    monthlyGrowthRate: 5, // % per månad
    priceIncreaseYear: 3, // % per år
    timeHorizon: 36, // månader
    
    // Scenarioparametrar
    conservativeGrowth: 3, // %
    realisticGrowth: 5, // %
    optimisticGrowth: 8, // %
  });

  // Uppdatera värden från kalkylatorn
  React.useEffect(() => {
    setForecastData(prev => ({
      ...prev,
      currentMonthlyRevenue: revenue.monthlyRevenueExVat || prev.currentMonthlyRevenue,
      currentTreatmentsPerDay: treatmentsPerDay || prev.currentTreatmentsPerDay,
      pricePerTreatment: customerPrice || prev.pricePerTreatment,
      workDaysPerMonth: workDaysPerMonth || prev.workDaysPerMonth,
    }));
  }, [revenue.monthlyRevenueExVat, treatmentsPerDay, customerPrice, workDaysPerMonth]);

  // Beräkna tillväxtprognos
  const calculateGrowthForecast = (growthRate: number) => {
    const data = [];
    let currentRevenue = forecastData.currentMonthlyRevenue;
    let currentTreatments = forecastData.currentTreatmentsPerDay;
    let currentPrice = forecastData.pricePerTreatment;

    for (let month = 0; month <= forecastData.timeHorizon; month++) {
      // Prisökning varje år
      if (month > 0 && month % 12 === 0) {
        currentPrice *= (1 + forecastData.priceIncreaseYear / 100);
      }

      // Behandlingstillväxt per månad
      if (month > 0) {
        currentTreatments *= (1 + growthRate / 100);
      }

      const monthlyTreatments = currentTreatments * forecastData.workDaysPerMonth;
      currentRevenue = monthlyTreatments * currentPrice;

      data.push({
        month,
        year: Math.floor(month / 12) + 1,
        quarter: Math.floor(month / 3) + 1,
        monthlyRevenue: Math.round(currentRevenue),
        treatmentsPerDay: Math.round(currentTreatments * 10) / 10,
        pricePerTreatment: Math.round(currentPrice),
        yearlyRevenue: Math.round(currentRevenue * 12),
        cumulativeRevenue: month === 0 ? Math.round(currentRevenue) : 
          data[month - 1]?.cumulativeRevenue + Math.round(currentRevenue)
      });
    }

    return data;
  };

  // Beräkna för alla scenarier
  const conservativeData = calculateGrowthForecast(forecastData.conservativeGrowth);
  const realisticData = calculateGrowthForecast(forecastData.realisticGrowth);
  const optimisticData = calculateGrowthForecast(forecastData.optimisticGrowth);

  // Kombinera data för jämförelse
  const combinedData = realisticData.map((realistic, index) => ({
    month: realistic.month,
    conservative: conservativeData[index]?.monthlyRevenue || 0,
    realistic: realistic.monthlyRevenue,
    optimistic: optimisticData[index]?.monthlyRevenue || 0,
  }));

  // Årlig sammanfattning
  const yearlyData = [1, 2, 3].map(year => {
    const yearIndex = year * 12;
    return {
      year,
      conservative: conservativeData[yearIndex]?.yearlyRevenue || 0,
      realistic: realisticData[yearIndex]?.yearlyRevenue || 0,
      optimistic: optimisticData[yearIndex]?.yearlyRevenue || 0,
      conservativeTreatments: conservativeData[yearIndex]?.treatmentsPerDay || 0,
      realisticTreatments: realisticData[yearIndex]?.treatmentsPerDay || 0,
      optimisticTreatments: optimisticData[yearIndex]?.treatmentsPerDay || 0,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka till kalkylator
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Tillväxtprognos</h1>
          <p className="text-muted-foreground">
            Visualisera din framtida tillväxt och intäktsutveckling
          </p>
          {selectedMachine && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Baserat på din konfiguration med {selectedMachine.name}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Prognosparametrar</CardTitle>
                <CardDescription>
                  Justera parametrar för att modellera olika tillväxtscenarier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="monthlyGrowth">Månatlig tillväxt - Realistisk (%)</Label>
                  <Input
                    id="monthlyGrowth"
                    type="number"
                    step="0.5"
                    value={forecastData.realisticGrowth}
                    onChange={(e) => setForecastData(prev => ({
                      ...prev, 
                      realisticGrowth: Number(e.target.value)
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="conservativeGrowth">Månatlig tillväxt - Konservativ (%)</Label>
                  <Input
                    id="conservativeGrowth"
                    type="number"
                    step="0.5"
                    value={forecastData.conservativeGrowth}
                    onChange={(e) => setForecastData(prev => ({
                      ...prev, 
                      conservativeGrowth: Number(e.target.value)
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="optimisticGrowth">Månatlig tillväxt - Optimistisk (%)</Label>
                  <Input
                    id="optimisticGrowth"
                    type="number"
                    step="0.5"
                    value={forecastData.optimisticGrowth}
                    onChange={(e) => setForecastData(prev => ({
                      ...prev, 
                      optimisticGrowth: Number(e.target.value)
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="priceIncrease">Årlig prisökning (%)</Label>
                  <Input
                    id="priceIncrease"
                    type="number"
                    step="0.5"
                    value={forecastData.priceIncreaseYear}
                    onChange={(e) => setForecastData(prev => ({
                      ...prev, 
                      priceIncreaseYear: Number(e.target.value)
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="timeHorizon">Prognosperiod</Label>
                  <Select 
                    value={forecastData.timeHorizon.toString()}
                    onValueChange={(value) => setForecastData(prev => ({
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
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Nuvarande status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Nuvarande status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <BarChart className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-lg font-bold text-blue-700">{forecastData.currentTreatmentsPerDay}</p>
                    <p className="text-xs text-blue-600">behandl/dag</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
                    <p className="text-lg font-bold text-green-700">{formatCurrency(forecastData.pricePerTreatment)}</p>
                    <p className="text-xs text-green-600">pris/behandl</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Månatlig intäkt:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(forecastData.currentMonthlyRevenue)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tillväxtgrafen */}
            <Card>
              <CardHeader>
                <CardTitle>Intäktsutveckling över tid</CardTitle>
                <CardDescription>
                  Månatlig intäkt under olika tillväxtscenarier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tickFormatter={(value) => `${value}m`}
                      />
                      <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value: any, name) => [
                          formatCurrency(value), 
                          name === 'conservative' ? 'Konservativ' :
                          name === 'realistic' ? 'Realistisk' : 'Optimistisk'
                        ]}
                        labelFormatter={(label) => `Månad ${label}`}
                      />
                      
                      <Area 
                        type="monotone" 
                        dataKey="conservative" 
                        stackId="1"
                        stroke="#ef4444" 
                        fill="#ef4444"
                        fillOpacity={0.2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="realistic" 
                        stackId="2"
                        stroke="#3b82f6" 
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="optimistic" 
                        stackId="3"
                        stroke="#22c55e" 
                        fill="#22c55e"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Årlig sammanfattning */}
            <Card>
              <CardHeader>
                <CardTitle>Årlig projektion</CardTitle>
                <CardDescription>
                  Intäkter och behandlingsvolym per år
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">År</th>
                        <th className="text-right py-2">Konservativ</th>
                        <th className="text-right py-2">Realistisk</th>
                        <th className="text-right py-2">Optimistisk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyData.map((year) => (
                        <tr key={year.year} className="border-b">
                          <td className="py-3 font-medium">År {year.year}</td>
                          <td className="text-right py-3">
                            <div>{formatCurrency(year.conservative)}</div>
                            <div className="text-xs text-muted-foreground">
                              {Math.round(year.conservativeTreatments)} behandl/dag
                            </div>
                          </td>
                          <td className="text-right py-3">
                            <div className="font-medium">{formatCurrency(year.realistic)}</div>
                            <div className="text-xs text-muted-foreground">
                              {Math.round(year.realisticTreatments)} behandl/dag
                            </div>
                          </td>
                          <td className="text-right py-3">
                            <div>{formatCurrency(year.optimistic)}</div>
                            <div className="text-xs text-muted-foreground">
                              {Math.round(year.optimisticTreatments)} behandl/dag
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">📈 Tillväxtinsikter</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Realistiskt scenario: {Math.round(((realisticData[36]?.monthlyRevenue || 0) / forecastData.currentMonthlyRevenue - 1) * 100)}% tillväxt över 3 år</li>
                    <li>• Optimistiskt scenario ger {formatCurrency((optimisticData[36]?.monthlyRevenue || 0) - (realisticData[36]?.monthlyRevenue || 0))} mer per månad år 3</li>
                    <li>• Viktigt att följa upp och justera prognoser baserat på faktisk utveckling</li>
                  </ul>
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

export default GrowthForecast;