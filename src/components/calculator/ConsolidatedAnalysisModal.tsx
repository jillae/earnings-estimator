import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart3, Target, Download } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';

// Import alla analys-komponenter
import DetailedAnalysisContent from './analysis/DetailedAnalysisContent';
import BreakEvenAnalysisContent from './analysis/BreakEvenAnalysisContent';
import ROIAnalysisContent from './analysis/ROIAnalysisContent';
import GrowthAnalysisContent from './analysis/GrowthAnalysisContent';

interface ConsolidatedAnalysisModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ConsolidatedAnalysisModal: React.FC<ConsolidatedAnalysisModalProps> = ({
  trigger,
  open,
  onOpenChange
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { selectedMachine, revenue, netResults } = useCalculator();

  const defaultTrigger = (
    <Button 
      variant="default" 
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
    >
      <BarChart3 className="w-4 h-4 mr-2" />
      Detaljerad analys & grafik
    </Button>
  );

  // Beräkna snabba KPI:er för översikt
  const monthlyRevenue = revenue?.monthlyRevenueExVat || 0;
  const monthlyNet = netResults?.netPerMonthExVat || 0;
  const yearlyNet = netResults?.netPerYearExVat || 0;
  const roi = monthlyRevenue > 0 ? (monthlyNet / monthlyRevenue) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Analys & Grafisk Översikt
              </DialogTitle>
              {selectedMachine && (
                <p className="text-sm text-slate-600 mt-1">
                  Maskin: <span className="font-medium">{selectedMachine.name}</span>
                </p>
              )}
            </div>
            
            {/* Snabba KPI:er */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700">
                  {Math.round(roi)}%
                </div>
                <div className="text-xs text-slate-500">ROI Marginal</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-700">
                  {(monthlyNet / 1000).toFixed(0)}k
                </div>
                <div className="text-xs text-slate-500">Netto/mån</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-700">
                  {(yearlyNet / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-slate-500">Netto/år</div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4 grid w-fit grid-cols-4 bg-slate-100">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <PieChartIcon className="w-4 h-4 mr-2" />
                Översikt
              </TabsTrigger>
              <TabsTrigger value="growth" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Tillväxt
              </TabsTrigger>
              <TabsTrigger value="breakeven" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                <Target className="w-4 h-4 mr-2" />
                Break-even
              </TabsTrigger>
              <TabsTrigger value="roi" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                ROI-analys
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <TabsContent value="overview" className="mt-4 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <DetailedAnalysisContent />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Snabb Genomgång
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Månatlig intäkt:</span>
                          <span className="font-medium">{(monthlyRevenue / 1000).toFixed(0)}k kr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Månatligt netto:</span>
                          <span className="font-medium">{(monthlyNet / 1000).toFixed(0)}k kr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Marginal:</span>
                          <span className="font-medium">{Math.round(roi)}%</span>
                        </div>
                        <div className="pt-2 border-t border-blue-200">
                          <div className="flex justify-between">
                            <span className="text-blue-700 font-medium">Årligt netto:</span>
                            <span className="font-bold text-blue-900">{(yearlyNet / 1000000).toFixed(1)}M kr</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-900 mb-3">📈 Nästa Steg</h4>
                      <div className="space-y-2 text-sm text-emerald-700">
                        <p>• Utforska tillväxtscenarier i Tillväxt-fliken</p>
                        <p>• Analysera break-even i scenarioanalysen</p>
                        <p>• Planera ROI med 5-års prognosen</p>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => setActiveTab('growth')}
                      >
                        Börja med Tillväxtanalys
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="growth" className="mt-4">
                <GrowthAnalysisContent />
              </TabsContent>

              <TabsContent value="breakeven" className="mt-4">
                <BreakEvenAnalysisContent />
              </TabsContent>

              <TabsContent value="roi" className="mt-4">
                <ROIAnalysisContent />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer med export och guide-knappar */}
        <div className="border-t bg-slate-50 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Live Data
            </Badge>
            <span className="text-xs text-slate-500">
              Alla värden hämtas dynamiskt från kalkylatorn
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/manual', '_blank')}
            >
              📖 Guide
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/contact', '_blank')}
            >
              💬 Support
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Exportera
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsolidatedAnalysisModal;