
import React, { useState } from 'react';
import ResultsTable from '../ResultsTable';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { SaveConfigurationButton } from './SaveConfigurationButton';
import { QuoteRequestButton } from './QuoteRequestButton';
import DetailedAnalysisModal from './DetailedAnalysisModal';
import ROIAnalysisModal from './ROIAnalysisModal';
import BreakEvenAnalysisModal from './BreakEvenAnalysisModal';
import ExportButton from '@/components/ExportButton';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target } from 'lucide-react';

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

  // State för modaler
  const [roiModalOpen, setRoiModalOpen] = useState(false);
  const [breakEvenModalOpen, setBreakEvenModalOpen] = useState(false);

  // Kontrollera om vi har tillräckligt med data för analyserna
  const hasEnoughDataForAnalysis = selectedMachine && treatmentsPerDay > 0 && customerPrice > 0;

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
                onClick={() => setRoiModalOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                ROI Analys
              </Button>
              
              <Button
                onClick={() => setBreakEvenModalOpen(true)}
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
      
      {/* Modaler */}
      <ROIAnalysisModal 
        open={roiModalOpen} 
        onOpenChange={setRoiModalOpen} 
      />
      
      <BreakEvenAnalysisModal 
        open={breakEvenModalOpen} 
        onOpenChange={setBreakEvenModalOpen} 
      />
    </div>
  );
};

export default CalculatorResults;
