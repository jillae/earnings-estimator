import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3, FileText } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
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
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Bankrapport & Finansiering
            </TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[70vh] mt-4">
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