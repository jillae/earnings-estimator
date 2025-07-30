import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, LineChart, Download, Share2, BookOpen, Calculator, Printer } from 'lucide-react';

// Import innehållskomponenter (skapar separata komponenter för detta)
import GrowthAnalysisContent from './analysis/GrowthAnalysisContent';
import ROIAnalysisContent from './analysis/ROIAnalysisContent';
import BreakEvenAnalysisContent from './analysis/BreakEvenAnalysisContent';

interface AnalysisHubModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'growth' | 'roi' | 'breakeven';
}

const AnalysisHubModal: React.FC<AnalysisHubModalProps> = ({ 
  open, 
  onOpenChange, 
  defaultTab = 'growth' 
}) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'roi' | 'breakeven'>(defaultTab);

  const handleExport = () => {
    // Implementation för export
    console.log('Exporterar rapport för:', activeTab);
  };

  const handleShare = () => {
    // Implementation för delning
    console.log('Delar analys:', activeTab);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Fördjupad Affärsanalys
          </DialogTitle>
          <DialogDescription>
            Tre kraftfulla verktyg för att analysera din investering från olika perspektiv
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'growth' | 'roi' | 'breakeven')} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="growth" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tillväxtprognos
            </TabsTrigger>
            <TabsTrigger value="roi" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              ROI Analys
            </TabsTrigger>
            <TabsTrigger value="breakeven" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Break-Even Analys
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="growth" className="mt-0 h-full">
              <GrowthAnalysisContent />
            </TabsContent>

            <TabsContent value="roi" className="mt-0 h-full">
              <ROIAnalysisContent />
            </TabsContent>

            <TabsContent value="breakeven" className="mt-0 h-full">
              <BreakEvenAnalysisContent />
            </TabsContent>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportera Rapport
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Dela Analys
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Skriv ut
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Analysguide
                </Button>
                <Button onClick={() => onOpenChange(false)}>
                  Stäng
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisHubModal;