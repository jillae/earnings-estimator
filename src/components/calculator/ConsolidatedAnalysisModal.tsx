import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';

// Import endast bank rapport
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
  const { selectedMachine, revenue, netResults } = useCalculator();

  const defaultTrigger = (
    <Button 
      variant="default" 
      className="w-fit bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
    >
      <BarChart3 className="w-4 h-4 mr-2" />
      Bankrapport
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                🏦 Bankrapport
              </DialogTitle>
              {selectedMachine && (
                <p className="text-sm text-slate-600 mt-1">
                  Professionell rapport för <span className="font-medium">{selectedMachine.name}</span>
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="mt-4">
            <BankReport />
          </div>
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