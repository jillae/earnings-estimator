
import React from 'react';
import ResultsTable from '../ResultsTable';
import { useCalculator } from '@/context/CalculatorContext';

const CalculatorResults: React.FC = () => {
  const {
    revenue,
    leasingCost,
    operatingCost,
    netResults,
    occupancyRevenues
  } = useCalculator();

  return (
    <div className="h-full flex items-start">
      <ResultsTable 
        dailyRevenueIncVat={revenue.dailyRevenueIncVat}
        weeklyRevenueIncVat={revenue.weeklyRevenueIncVat}
        monthlyRevenueIncVat={revenue.monthlyRevenueIncVat}
        yearlyRevenueIncVat={revenue.yearlyRevenueIncVat}
        leasingCostPerMonth={leasingCost}
        operatingCostPerMonth={operatingCost.costPerMonth}
        netPerMonthExVat={netResults.netPerMonthExVat}
        netPerYearExVat={netResults.netPerYearExVat}
        occupancy50={occupancyRevenues.occupancy50}
        occupancy75={occupancyRevenues.occupancy75}
        occupancy100={occupancyRevenues.occupancy100}
      />
    </div>
  );
};

export default CalculatorResults;
