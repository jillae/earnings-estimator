
import React, { useState } from 'react';
import ResultsTable from '../ResultsTable';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { SaveConfigurationButton } from './SaveConfigurationButton';
import { QuoteRequestButton } from './QuoteRequestButton';
import DetailedAnalysisModal from './DetailedAnalysisModal';
import AnalysisHubModal from './AnalysisHubModal';
import ExportButton from '@/components/ExportButton';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, LineChart } from 'lucide-react';

const CalculatorResults: React.FC<{ hoveredInput?: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null }> = ({ hoveredInput = null }) => {
  const {
    revenue,
    leasingCost,
    operatingCost,
    netResults,
    occupancyRevenues,
    paymentOption,
    cashPriceSEK,
    useFlatrateOption,
    selectedDriftpaket,
    treatmentsPerDay,
    customerPrice,
    selectedSlaLevel,
    selectedMachine
  } = useCalculator();

  // State för modal
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [analysisTab, setAnalysisTab] = useState<'growth' | 'roi' | 'breakeven'>('growth');

  // Kontrollera om vi har tillräckligt med data för analyserna
  const hasEnoughDataForAnalysis = selectedMachine && treatmentsPerDay > 0 && customerPrice > 0;

  const openAnalysisModal = (tab: 'growth' | 'roi' | 'breakeven') => {
    setAnalysisTab(tab);
    setAnalysisModalOpen(true);
  };

  // Lägg till loggning för felsökning
  console.log(`CalculatorResults rendering:
    Monthly revenue (inc VAT): ${revenue.monthlyRevenueIncVat}
    Monthly revenue (ex VAT): ${revenue.monthlyRevenueExVat}
    Operating cost: ${operatingCost.totalCost}
    Leasing cost: ${leasingCost}
    Total monthly cost: ${operatingCost.totalCost + leasingCost}
    Net per month: ${netResults.netPerMonthExVat}
    Payment option: ${paymentOption}
  `);

  return (
    <div className="h-full">
      <div className="sticky top-4 z-20 bg-white/95 backdrop-blur-sm rounded-lg">
        <ResultsTable
        dailyRevenueIncVat={revenue.dailyRevenueIncVat}
        weeklyRevenueIncVat={revenue.weeklyRevenueIncVat}
        monthlyRevenueIncVat={revenue.monthlyRevenueIncVat}
        yearlyRevenueIncVat={revenue.yearlyRevenueIncVat}
        leasingCostPerMonth={leasingCost}
        operatingCostPerMonth={operatingCost.totalCost}
        paymentOption={paymentOption}
        cashPriceSEK={cashPriceSEK}
        netPerMonthExVat={netResults.netPerMonthExVat}
        netPerYearExVat={netResults.netPerYearExVat}
        occupancy50={occupancyRevenues.occupancy50}
        occupancy75={occupancyRevenues.occupancy75}
        occupancy100={occupancyRevenues.occupancy100}
        isFlatrateActive={useFlatrateOption === 'flatrate'}
        selectedSlaLevel={selectedSlaLevel}
        treatmentsPerDay={treatmentsPerDay}
        customerPrice={customerPrice}
        slaCost={operatingCost.slaCost}
         creditCost={operatingCost.costPerMonth}
         hoveredInput={hoveredInput}
         />
         
        {/* Fördjupad Analys Knappar */}
        {hasEnoughDataForAnalysis && (
          <div className="mt-4 p-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Fördjupad Analys</h4>
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => openAnalysisModal('growth')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LineChart className="h-4 w-4" />
                Tillväxtprognos
              </Button>
              
              <Button
                onClick={() => openAnalysisModal('roi')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                ROI Analys
              </Button>
              
              <Button
                onClick={() => openAnalysisModal('breakeven')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Break-Even Analys
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Unified Analysis Modal */}
      <AnalysisHubModal 
        open={analysisModalOpen} 
        onOpenChange={setAnalysisModalOpen}
        defaultTab={analysisTab}
      />
    </div>
  );
};

export default CalculatorResults;
