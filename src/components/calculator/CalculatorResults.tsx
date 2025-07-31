import React from 'react';
import ResultsTable from '../ResultsTable';
import { useCalculator } from '@/context/CalculatorContext';

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

  // Debug logging för nettoresultat
  console.log(`Calculator Results Debug:
    Leasing cost: ${leasingCost}
    Operating cost: ${operatingCost.totalCost}
    Monthly revenue (incl VAT): ${revenue.monthlyRevenueIncVat}
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