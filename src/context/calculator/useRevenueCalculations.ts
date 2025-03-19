
import { useState, useEffect } from 'react';
import { 
  calculateRevenue,
  calculateOccupancyRevenues,
  calculateNetResults
} from '@/utils/calculatorUtils';

export function useRevenueCalculations({
  customerPrice,
  treatmentsPerDay,
  leasingCost,
  operatingCost
}: {
  customerPrice: number;
  treatmentsPerDay: number;
  leasingCost: number;
  operatingCost: { costPerMonth: number, useFlatrate: boolean };
}) {
  const [revenue, setRevenue] = useState<any>({
    revenuePerTreatmentExVat: 0,
    dailyRevenueIncVat: 0,
    weeklyRevenueIncVat: 0,
    monthlyRevenueIncVat: 0,
    yearlyRevenueIncVat: 0,
    monthlyRevenueExVat: 0,
    yearlyRevenueExVat: 0
  });
  
  const [occupancyRevenues, setOccupancyRevenues] = useState<any>({
    occupancy50: 0,
    occupancy75: 0,
    occupancy100: 0
  });
  
  const [netResults, setNetResults] = useState<any>({
    netPerMonthExVat: 0,
    netPerYearExVat: 0
  });

  // Calculate revenue and occupancy
  useEffect(() => {
    const calculatedRevenue = calculateRevenue(customerPrice, treatmentsPerDay);
    setRevenue(calculatedRevenue);
    
    const calculatedOccupancyRevenues = calculateOccupancyRevenues(calculatedRevenue.yearlyRevenueIncVat);
    setOccupancyRevenues(calculatedOccupancyRevenues);
  }, [customerPrice, treatmentsPerDay]);

  // Calculate net results
  useEffect(() => {
    const totalMonthlyCostExVat = leasingCost + operatingCost.costPerMonth;
    
    const calculatedNetResults = calculateNetResults(
      revenue.monthlyRevenueExVat,
      revenue.yearlyRevenueExVat,
      totalMonthlyCostExVat
    );
    
    setNetResults(calculatedNetResults);
  }, [revenue, leasingCost, operatingCost]);

  return {
    revenue,
    occupancyRevenues,
    netResults
  };
}
