import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GrowthAnalysisContent from './analysis/GrowthAnalysisContent';
import ROIAnalysisContent from './analysis/ROIAnalysisContent';
import BreakEvenAnalysisContent from './analysis/BreakEvenAnalysisContent';
import DetailedAnalysisContent from './analysis/DetailedAnalysisContent';
import { Button } from '@/components/ui/button';
import { Download, Share, Printer, BookOpen, X } from 'lucide-react';

interface AnalysisHubModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'detailed' | 'growth' | 'roi' | 'breakeven';
}

export const AnalysisHubModal: React.FC<AnalysisHubModalProps> = ({
  open,
  onOpenChange,
  defaultTab = 'detailed'
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Finansiell Analys
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="detailed" className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              Detaljerad Analys
            </TabsTrigger>
            <TabsTrigger value="growth" className="flex items-center gap-2">
              <span className="text-lg">📈</span>
              Tillväxtanalys
            </TabsTrigger>
            <TabsTrigger value="roi" className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              ROI Analys
            </TabsTrigger>
            <TabsTrigger value="breakeven" className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Break-Even
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <TabsContent value="detailed" className="space-y-6">
              <DetailedAnalysisContent />
            </TabsContent>
            
            <TabsContent value="growth" className="space-y-6">
              <GrowthAnalysisContent />
            </TabsContent>
            
            <TabsContent value="roi" className="space-y-6">
              <ROIAnalysisContent />
            </TabsContent>
            
            <TabsContent value="breakeven" className="space-y-6">
              <BreakEvenAnalysisContent />
            </TabsContent>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportera
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Dela
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Skriv ut
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Guide
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4 mr-2" />
                Stäng
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};