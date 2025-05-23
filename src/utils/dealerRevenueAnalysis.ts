
/**
 * Utility för att analysera återförsäljarens intäkter från olika leasingalternativ
 */
import { Machine } from '@/data/machines/types';
import { machineData } from '@/data/machines';
import { calculateLeasingRange } from './leasingRangeUtils';
import { formatCurrency } from './formatUtils';
import { LEASING_TARIFFS_2024, WORKING_DAYS_PER_MONTH } from './constants';

export interface DealerRevenueAnalysis {
  machineName: string;
  machineId: string;
  standardLeasingAmount: number;
  maxLeasingAmount: number;
  difference: number;
  differencePercent: number;
  usesCredits: boolean;
  monthlyCreditsRevenue: number; // Intäkt från credits per månad baserat på 2 kunder/dag
  revenue36Month: number; // Total intäkt över 36 månader
  revenue60Month: number; // Total intäkt över 60 månader
  monthlyRevenueDifference: number; // Månatlig skillnad i intäkt
  differenceComparisonRatio: number; // Jämförelse av skillnad 36/60 månader
  totalLeasingDifference36Month: number; // Total leasingskillnad över 36 månader
  totalLeasingDifference60Month: number; // Total leasingskillnad över 60 månader
  totalCreditsRevenue36Month: number; // Total kreditintäkt över 36 månader
  totalCreditsRevenue60Month: number; // Total kreditintäkt över 60 månader
}

/**
 * Beräknar återförsäljarens intäkt vid standard vs max leasing
 * för samtliga maskiner i sortimentet
 * 
 * @param exchangeRate Växelkurs mot EUR
 * @param includeInsurance Inkludera försäkring i beräkningen
 * @param excludeMachineIds Array med IDs på maskiner som ska exkluderas
 * @returns Array med analysdata för varje maskin
 */
export function calculateDealerRevenue(
  exchangeRate: number = 11.49260,
  includeInsurance: boolean = false,
  excludeMachineIds: string[] = []
): DealerRevenueAnalysis[] {
  // Filtrera bort maskiner utan prissättning och exkluderade maskiner
  const validMachines = machineData.filter(
    machine => machine.priceEur && machine.priceEur > 0 && !excludeMachineIds.includes(machine.id)
  );
  
  // Använd leasingperiod 60 månader för standardberäkning
  const leasingRate60 = LEASING_TARIFFS_2024.find(period => period.id === '60')?.rate || 0.02095;
  // Rate för 36 månader
  const leasingRate36 = LEASING_TARIFFS_2024.find(period => period.id === '36')?.rate || 0.03189;
  
  // Beräkna för varje maskin
  return validMachines.map(machine => {
    // Beräkna maskinpriset i SEK
    const machinePriceSEK = machine.priceEur * exchangeRate;
    
    // Beräkna leasingintervall för maskinen (60 månader)
    const leasingRange60 = calculateLeasingRange(machine, machinePriceSEK, leasingRate60, includeInsurance);
    
    // Beräkna leasingintervall för 36 månader
    const leasingRange36 = calculateLeasingRange(machine, machinePriceSEK, leasingRate36, includeInsurance);
    
    // Skillnad mellan standard och max
    const difference = leasingRange60.max - leasingRange60.default;
    
    // Procentuell skillnad
    const differencePercent = leasingRange60.default > 0 
      ? (difference / leasingRange60.default) * 100
      : 0;
    
    // Beräkna intäkt från krediter om maskinen använder credits
    // Baserat på 2 kunder per dag, 22 arbetsdagar per månad (uppdaterat från 20)
    const treatmentsPerMonth = 2 * WORKING_DAYS_PER_MONTH; // 2 kunder/dag * 22 dagar/månad
    const creditsPerTreatment = machine.creditsPerTreatment || 1;
    const creditRevenue = machine.usesCredits ? 
      treatmentsPerMonth * creditsPerTreatment * (machine.creditMax || 0) : 0;
    
    // Total intäkt över 36 och 60 månader - vi måste inkludera krediter för maskiner 
    // som använder dem i båda perioder
    const revenue36Month = machine.usesCredits ? 
      leasingRange36.max * 36 + creditRevenue * 36 : leasingRange36.max * 36;
    
    const revenue60Month = machine.usesCredits ? 
      leasingRange60.max * 60 + creditRevenue * 60 : leasingRange60.max * 60;
    
    // Månatlig skillnad i intäkt (för att täcka förlust av credits vs 36 månader)
    const monthlyRevenueDifference = machine.usesCredits ? 
      leasingRange36.max - leasingRange60.max - creditRevenue : 
      leasingRange36.max - leasingRange60.max;
      
    // Jämförelsetal: Månatlig skillnad * 36 / 60
    const differenceComparisonRatio = difference * (36 / 60);
    
    // Nya värden för kolumner
    const totalLeasingDifference36Month = difference * 36; // Total leasingskillnad över 36 månader
    const totalLeasingDifference60Month = difference * 60; // Total leasingskillnad över 60 månader
    const totalCreditsRevenue36Month = creditRevenue * 36; // Total kreditintäkt över 36 månader
    const totalCreditsRevenue60Month = creditRevenue * 60; // Total kreditintäkt över 60 månader
    
    return {
      machineName: machine.name,
      machineId: machine.id,
      standardLeasingAmount: leasingRange60.default,
      maxLeasingAmount: leasingRange60.max,
      difference,
      differencePercent,
      usesCredits: machine.usesCredits,
      monthlyCreditsRevenue: creditRevenue,
      revenue36Month,
      revenue60Month,
      monthlyRevenueDifference,
      differenceComparisonRatio,
      totalLeasingDifference36Month,
      totalLeasingDifference60Month,
      totalCreditsRevenue36Month,
      totalCreditsRevenue60Month
    };
  });
}

/**
 * Beräknar total intäkt från alla maskiner vid standard vs max leasing
 */
export function calculateTotalRevenueDifference(
  exchangeRate: number = 11.49260,
  includeInsurance: boolean = false,
  excludeMachineIds: string[] = []
): {
  totalStandard: number;
  totalMax: number;
  totalDifference: number;
  averagePercentIncrease: number;
  total36MonthRevenue: number;
  total60MonthRevenue: number;
} {
  const analyses = calculateDealerRevenue(exchangeRate, includeInsurance, excludeMachineIds);
  
  const totalStandard = analyses.reduce((sum, item) => sum + item.standardLeasingAmount, 0);
  const totalMax = analyses.reduce((sum, item) => sum + item.maxLeasingAmount, 0);
  const totalDifference = totalMax - totalStandard;
  
  const total36MonthRevenue = analyses.reduce((sum, item) => sum + item.revenue36Month, 0);
  const total60MonthRevenue = analyses.reduce((sum, item) => sum + item.revenue60Month, 0);
  
  // Genomsnittlig procentuell ökning (endast för maskiner med värde > 0)
  const validItems = analyses.filter(item => item.standardLeasingAmount > 0);
  const averagePercentIncrease = validItems.length > 0
    ? validItems.reduce((sum, item) => sum + item.differencePercent, 0) / validItems.length
    : 0;
  
  return {
    totalStandard,
    totalMax,
    totalDifference,
    averagePercentIncrease,
    total36MonthRevenue,
    total60MonthRevenue
  };
}

// Formatera analysdata för utskrift
export function formatRevenueAnalysis(analyses: DealerRevenueAnalysis[]): string {
  let result = 'ÅTERFÖRSÄLJARINTÄKT - STANDARD VS MAX LEASING\n';
  result += '================================================\n\n';
  
  // Sortera efter högst skillnad
  const sortedAnalyses = [...analyses].sort((a, b) => b.difference - a.difference);
  
  sortedAnalyses.forEach(item => {
    result += `${item.machineName} (${item.machineId}):\n`;
    result += `  Standard: ${formatCurrency(item.standardLeasingAmount)}\n`;
    result += `  Max: ${formatCurrency(item.maxLeasingAmount)}\n`;
    result += `  Skillnad: ${formatCurrency(item.difference)} (+${item.differencePercent.toFixed(1)}%)\n`;
    result += `  Använder krediter: ${item.usesCredits ? 'Ja' : 'Nej'}\n`;
    if (item.usesCredits) {
      result += `  Kreditintäkt/månad: ${formatCurrency(item.monthlyCreditsRevenue)}\n`;
    }
    result += `  Total intäkt 36m: ${formatCurrency(item.revenue36Month)}\n`;
    result += `  Total intäkt 60m: ${formatCurrency(item.revenue60Month)}\n\n`;
  });
  
  // Lägga till summering
  const totals = calculateTotalRevenueDifference();
  result += 'SUMMERING\n';
  result += '=========\n';
  result += `Total intäkt med standardleasing: ${formatCurrency(totals.totalStandard)}\n`;
  result += `Total intäkt med max leasing: ${formatCurrency(totals.totalMax)}\n`;
  result += `Total skillnad: ${formatCurrency(totals.totalDifference)} (+${totals.averagePercentIncrease.toFixed(1)}%)\n`;
  result += `Total intäkt över 36 månader: ${formatCurrency(totals.total36MonthRevenue)}\n`;
  result += `Total intäkt över 60 månader: ${formatCurrency(totals.total60MonthRevenue)}\n`;
  
  return result;
}
