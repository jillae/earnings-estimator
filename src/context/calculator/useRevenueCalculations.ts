
import { useState, useEffect } from 'react';
import { 
  calculateRevenue,
  calculateOccupancyRevenues,
  calculateNetResults
} from '@/utils/calculatorUtils';
import { MONTHS_PER_YEAR } from '@/utils/constants';

export function useRevenueCalculations({
  customerPrice,
  treatmentsPerDay,
  paymentOption = 'leasing',
  leasingCost,
  cashPriceSEK = 0,
  operatingCost
}: {
  customerPrice: number;
  treatmentsPerDay: number;
  paymentOption?: 'leasing' | 'cash';
  leasingCost: number;
  cashPriceSEK?: number;
  operatingCost: { 
    costPerMonth: number, 
    useFlatrate: boolean, 
    slaCost: number, 
    totalCost: number 
  };
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
    // Se till att parametrarna är i rätt ordning: treatmentsPerDay, customerPrice
    const calculatedRevenue = calculateRevenue(treatmentsPerDay, customerPrice);
    
    console.log(`useRevenueCalculations beräknar intäkter: 
      behandlingar/dag: ${treatmentsPerDay}
      kundpris: ${customerPrice}
      månadsintäkt (ex moms): ${calculatedRevenue.monthlyRevenueExVat}
      årsintäkt (ex moms): ${calculatedRevenue.yearlyRevenueExVat}
    `);
    
    setRevenue(calculatedRevenue);
    
    const calculatedOccupancyRevenues = calculateOccupancyRevenues(calculatedRevenue.yearlyRevenueIncVat);
    setOccupancyRevenues(calculatedOccupancyRevenues);
  }, [customerPrice, treatmentsPerDay]);

  // Calculate net results
  useEffect(() => {
    let investmentCostPerMonth = 0;
    
    if (paymentOption === 'leasing') {
      // För leasing, använd leasingCost som investeringskostnad per månad
      investmentCostPerMonth = leasingCost;
    } else {
      // För kontant, sprid kostnaden över 60 månader (5 år) som en ungefärlig avskrivningsperiod
      investmentCostPerMonth = cashPriceSEK / 60;
    }
    
    // Total månadskostnad: investeringskostnad + driftskostnad (som nu inkluderar SLA)
    const totalMonthlyCostExVat = investmentCostPerMonth + operatingCost.totalCost;
    
    const calculatedNetResults = calculateNetResults(
      revenue.monthlyRevenueExVat,
      revenue.yearlyRevenueExVat,
      totalMonthlyCostExVat
    );
    
    console.log(`Beräknar nettoresultat:
      Betalningsalternativ: ${paymentOption}
      Investeringskostnad/mån: ${investmentCostPerMonth}
      Total driftskostnad/mån: ${operatingCost.totalCost}
      Total kostnad/mån: ${totalMonthlyCostExVat}
      Intäkt/mån (ex moms): ${revenue.monthlyRevenueExVat}
      Netto/mån (ex moms): ${calculatedNetResults.netPerMonthExVat}
      Intäkt/år (ex moms): ${revenue.yearlyRevenueExVat}
      Netto/år (ex moms): ${calculatedNetResults.netPerYearExVat}
    `);
    
    setNetResults(calculatedNetResults);
  }, [revenue, leasingCost, cashPriceSEK, operatingCost, paymentOption]);

  return {
    revenue,
    occupancyRevenues,
    netResults
  };
}
