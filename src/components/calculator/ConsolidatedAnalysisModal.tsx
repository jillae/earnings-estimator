import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3, FileText, Calculator } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import GrowthAnalysisContent from './analysis/GrowthAnalysisContent';
import ROIAnalysisContent from './analysis/ROIAnalysisContent';
import BreakEvenAnalysisContent from './analysis/BreakEvenAnalysisContent';
import BankReport from './analysis/BankReport';

interface ConsolidatedAnalysisModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: string;
  trigger?: React.ReactNode;
}

const ConsolidatedAnalysisModal: React.FC<ConsolidatedAnalysisModalProps> = ({
  open = false,
  onOpenChange = () => {},
  defaultTab = "bank",
  trigger
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { selectedMachine } = useCalculator();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Avancerad Affärsanalys
            {selectedMachine && (
              <Badge variant="outline" className="ml-2">
                {selectedMachine.name}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="growth" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tillväxt
            </TabsTrigger>
            <TabsTrigger value="roi" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              ROI
            </TabsTrigger>
            <TabsTrigger value="breakeven" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Break-Even
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Bank
            </TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[70vh] mt-4">
            <TabsContent value="growth" className="mt-0">
              <GrowthAnalysisContent />
            </TabsContent>
            
            <TabsContent value="roi" className="mt-0">
              <ROIAnalysisContent />
            </TabsContent>
            
            <TabsContent value="breakeven" className="mt-0">
              <BreakEvenAnalysisContent />
            </TabsContent>
            <TabsContent value="bank" className="mt-0">
              <BankReport />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ConsolidatedAnalysisModal;