
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
        
        {/* Förbättrad action section med bättre UX/UI */}
        <div className="mt-8">
          {/* Klar separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-8"></div>
          
          {/* Nästa steg sektion */}
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-4 text-white text-center">
              <h3 className="text-xl font-bold mb-1">🎯 Nästa steg</h3>
              <p className="text-blue-100 text-sm">Välj vad du vill göra med din beräkning</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="group">
                  <SaveConfigurationButton />
                  <p className="text-xs text-slate-500 mt-2 text-center">Spara för senare användning</p>
                </div>
                <div className="group">
                  <QuoteRequestButton />
                  <p className="text-xs text-slate-500 mt-2 text-center">Få personlig offert</p>
                </div>
                <div className="group">
                  <DetailedAnalysisModal />
                  <p className="text-xs text-slate-500 mt-2 text-center">Djupare finansiell analys</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorResults;
