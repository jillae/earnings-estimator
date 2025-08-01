import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart3, Target, Download } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';

// Import nya förenklade analys-komponenter
import ProfitabilityCheck from './analysis/ProfitabilityCheck';
import SimplifiedTimeAnalysis from './analysis/SimplifiedTimeAnalysis';
import BankReport from './analysis/BankReport';

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
  const [activeTab, setActiveTab] = useState('profitable');
  const { selectedMachine, revenue, netResults } = useCalculator();

  const defaultTrigger = (
    <Button 
      variant="default" 
      className="w-fit bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
    >
      <BarChart3 className="w-4 h-4 mr-2" />
      Lönsam? Analys & Prognos
    </Button>
  );

  // Beräkna enkla KPI:er för header
  const monthlyRevenue = revenue?.monthlyRevenueExVat || 0;
  const monthlyNet = netResults?.netPerMonthExVat || 0;
  const yearlyNet = netResults?.netPerYearExVat || 0;
  const isProfitable = monthlyNet > 0;

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
                {isProfitable ? '✅ Lönsam Investering!' : '❗ Analys & Optimering'}
              </DialogTitle>
              {selectedMachine && (
                <p className="text-sm text-slate-600 mt-1">
                  Maskin: <span className="font-medium">{selectedMachine.name}</span>
                </p>
              )}
            </div>
            
            {/* Enkla KPI:er i vardagsspråk */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className={`text-lg font-bold ${isProfitable ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isProfitable ? 'JA' : 'NEJ'}
                </div>
                <div className="text-xs text-slate-500">Lönsamt?</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700">
                  {(monthlyNet / 1000).toFixed(0)}k
                </div>
                <div className="text-xs text-slate-500">Vinst/mån</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-700">
                  {(yearlyNet / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-slate-500">På 1 år</div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4 grid w-fit grid-cols-3 bg-slate-100">
              <TabsTrigger value="profitable" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <PieChartIcon className="w-4 h-4 mr-2" />
                Lönsam?
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Vad händer över tid?
              </TabsTrigger>
              <TabsTrigger value="bankreport" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Bankrapport
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <TabsContent value="profitable" className="mt-4">
                <ProfitabilityCheck />
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <SimplifiedTimeAnalysis />
              </TabsContent>

              <TabsContent value="bankreport" className="mt-4">
                <BankReport />
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
              Förenklade beräkningar för snabb överblick
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
              onClick={() => {
                // Öppna export-dialog från ExportButton
                const exportEvent = new CustomEvent('openExportModal');
                window.dispatchEvent(exportEvent);
              }}
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