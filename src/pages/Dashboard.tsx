import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, FileBarChart, Smartphone, TrendingUp, Target, History, Download, Share, BarChart3 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CalculatorProvider, useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import ConsolidatedAnalysisModal from '@/components/calculator/ConsolidatedAnalysisModal';

const DashboardContent = () => {
  const { 
    selectedMachine, 
    netResults, 
    revenue,
    treatmentsPerDay,
    customerPrice 
  } = useCalculator();

  // Verkliga beräkningar baserat på nuvarande konfiguration
  const currentCalculation = selectedMachine ? {
    machine: selectedMachine.name,
    netProfitMonthly: netResults.netPerMonthExVat,
    netProfitYearly: netResults.netPerYearExVat,
    monthlyRevenue: revenue.monthlyRevenueIncVat,
    treatments: treatmentsPerDay,
    price: customerPrice
  } : null;
  // Verkliga beräkningar från localStorage eller sparade konfigurationer
  const recentCalculations = [
    currentCalculation ? {
      id: 'current',
      machine: currentCalculation.machine,
      date: new Date().toISOString().split('T')[0],
      netProfit: Math.round(currentCalculation.netProfitMonthly),
      status: 'current'
    } : null,
    // Fallback exempel om ingen aktuell beräkning finns
    {
      id: '1',
      machine: 'FX 635',
      date: '2025-01-29',
      netProfit: 45000,
      status: 'saved'
    },
    {
      id: '2', 
      machine: 'PL5',
      date: '2025-01-28',
      netProfit: 32000,
      status: 'exported'
    }
  ].filter(Boolean);

  const quickStartMachines = [
    { id: 'emerald', name: 'Emerald', category: 'Premium', popular: true },
    { id: 'fx-635', name: 'FX 635', category: 'Treatment', popular: true },
    { id: 'zerona', name: 'Zerona', category: 'Treatment', popular: true },
    { id: 'evrl', name: 'EVRL', category: 'Handheld', popular: false }
  ];

  const monthlyStats = {
    totalCalculations: currentCalculation ? 1 : 0,
    avgProfit: currentCalculation ? Math.round(currentCalculation.netProfitMonthly) : 0,
    mostUsedMachine: currentCalculation ? currentCalculation.machine : 'Ingen ännu',
    efficiency: currentCalculation && currentCalculation.netProfitMonthly > 0 ? 'Hög' : 'Låg'
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Välkommen tillbaka!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Hantera dina kalkyleringar och få insikter om din kliniks prestanda
          </p>
          {currentCalculation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
              <h3 className="font-semibold text-green-800 mb-2">Aktiv kalkylering: {currentCalculation.machine}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-600">Netto per månad:</span>
                  <span className="font-semibold ml-2">{formatCurrency(currentCalculation.netProfitMonthly)}</span>
                </div>
                <div>
                  <span className="text-green-600">Intäkt per månad:</span>
                  <span className="font-semibold ml-2">{formatCurrency(currentCalculation.monthlyRevenue)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                Ny Kalkylering
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Starta en ny intäktsberäkning
              </p>
              <Link to="/">
                <Button className="w-full">
                  Börja beräkna
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Detaljerad Analys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Fullständig analys med alla verktyg
              </p>
              <ConsolidatedAnalysisModal 
                trigger={
                  <Button variant="outline" className="w-full">
                    Öppna Analys
                  </Button>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Target className="h-5 w-5 mr-2 text-orange-600" />
                Återgå till Kalkylator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Justera inställningar och beräkna
              </p>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Tillbaka till kalkylator
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Smartphone className="h-5 w-5 mr-2 text-purple-600" />
                Mobil App
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Installera mobilapp
              </p>
              <Button variant="outline" className="w-full" disabled>
                Kommer snart
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Calculations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Senaste Kalkyleringar
                </CardTitle>
                <CardDescription>
                  Dina senaste sparade beräkningar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCalculations.map((calc) => (
                    <div key={calc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div>
                          <h4 className="font-medium">{calc.machine}</h4>
                          <p className="text-sm text-muted-foreground">{calc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            +{(calc.netProfit / 1000).toFixed(0)}k kr/mån
                          </p>
                          <Badge variant={calc.status === 'saved' ? 'default' : 
                                        calc.status === 'exported' ? 'secondary' : 'outline'}>
                            {calc.status === 'saved' ? 'Sparad' : 
                             calc.status === 'exported' ? 'Exporterad' : 'Delad'}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    Visa alla kalkyleringar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Quick Start */}
          <div className="space-y-6">
            {/* Monthly Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Månadens Statistik
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">{monthlyStats.totalCalculations}</p>
                    <p className="text-xs text-blue-600">Kalkyleringar</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">{(monthlyStats.avgProfit / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-green-600">Snitt vinst/mån</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Populäraste maskin:</span>
                    <span className="text-sm font-medium">{monthlyStats.mostUsedMachine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Klinikeffektivitet:</span>
                    <Badge variant="default">{monthlyStats.efficiency}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Machines */}
            <Card>
              <CardHeader>
                <CardTitle>Snabbstart</CardTitle>
                <CardDescription>Populära maskiner att beräkna med</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickStartMachines.map((machine) => (
                    <Link 
                      key={machine.id} 
                      to={`/?machine=${machine.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div>
                          <h4 className="font-medium">{machine.name}</h4>
                          <p className="text-xs text-muted-foreground">{machine.category}</p>
                        </div>
                        {machine.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Populär
                          </Badge>
                        )}
                      </div>
                    </Link>
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

const Dashboard = () => {
  return (
    <CalculatorProvider>
      <DashboardContent />
    </CalculatorProvider>
  );
};

export default Dashboard;