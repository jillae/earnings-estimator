
import React from 'react';
import ResultsTable from '../ResultsTable';
import { useCalculator } from '@/context/CalculatorContext';
import { SaveConfigurationButton } from './SaveConfigurationButton';
import { QuoteRequestButton } from './QuoteRequestButton';
import DetailedAnalysisModal from './DetailedAnalysisModal';

const CalculatorResults: React.FC = () => {
  const {
    revenue,
    leasingCost,
    operatingCost,
    netResults,
    occupancyRevenues,
    paymentOption,
    cashPriceSEK,
    useFlatrateOption,
    selectedDriftpaket
  } = useCalculator();

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
        selectedSlaLevel={selectedDriftpaket}
        />
        
        {/* Action buttons i tydligt eget block */}
        <div className="mt-8 glass-card p-6 border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-slate-50/50">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Nästa steg</h3>
            <p className="text-sm text-slate-600">Välj vad du vill göra med din beräkning</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <SaveConfigurationButton />
            <QuoteRequestButton />
            <DetailedAnalysisModal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorResults;
