
import React from 'react';
import ResultsTable from '../ResultsTable';
import { useCalculator } from '@/context/CalculatorContext';
import { SaveConfigurationButton } from './SaveConfigurationButton';
import { QuoteRequestButton } from './QuoteRequestButton';
import DetailedAnalysisModal from './DetailedAnalysisModal';

const CalculatorResults: React.FC<{ hoveredInput?: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | null }> = ({ hoveredInput = null }) => {
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
    selectedSlaLevel
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
        selectedSlaLevel={selectedSlaLevel}
        treatmentsPerDay={treatmentsPerDay}
        customerPrice={customerPrice}
        slaCost={operatingCost.slaCost}
         creditCost={operatingCost.costPerMonth}
         hoveredInput={hoveredInput}
         />
      </div>
    </div>
  );
};

export default CalculatorResults;
