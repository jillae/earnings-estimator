
/**
 * Utility för att analysera återförsäljarens intäkter från olika leasingalternativ
 */
import { Machine } from '@/data/machines/types';
import { machineData } from '@/data/machines';
import { calculateLeasingRange } from './leasingRangeUtils';
import { formatCurrency } from './formatUtils';
import { LEASING_TARIFFS_2024 } from './constants';

export interface DealerRevenueAnalysis {
  machineName: string;
  machineId: string;
  standardLeasingAmount: number;
  maxLeasingAmount: number;
  difference: number;
  differencePercent: number;
  usesCredits: boolean;
}

/**
 * Beräknar återförsäljarens intäkt vid standard vs max leasing
 * för samtliga maskiner i sortimentet
 * 
 * @param exchangeRate Växelkurs mot EUR
 * @param includeInsurance Inkludera försäkring i beräkningen
 * @returns Array med analysdata för varje maskin
 */
export function calculateDealerRevenue(
  exchangeRate: number = 11.49260,
  includeInsurance: boolean = false
): DealerRevenueAnalysis[] {
  // Filtrera bort maskiner utan prissättning
  const validMachines = machineData.filter(machine => machine.priceEur && machine.priceEur > 0);
  
  // Använd leasingperiod 60 månader för standardberäkning
  const leasingRate = LEASING_TARIFFS_2024.find(period => period.id === '60')?.rate || 0.02095;
  
  // Beräkna för varje maskin
  return validMachines.map(machine => {
    // Beräkna maskinpriset i SEK
    const machinePriceSEK = machine.priceEur * exchangeRate;
    
    // Beräkna leasingintervall för maskinen
    const leasingRange = calculateLeasingRange(machine, machinePriceSEK, leasingRate, includeInsurance);
    
    // Skillnad mellan standard och max
    const difference = leasingRange.max - leasingRange.default;
    
    // Procentuell skillnad
    const differencePercent = leasingRange.default > 0 
      ? (difference / leasingRange.default) * 100
      : 0;
    
    return {
      machineName: machine.name,
      machineId: machine.id,
      standardLeasingAmount: leasingRange.default,
      maxLeasingAmount: leasingRange.max,
      difference,
      differencePercent,
      usesCredits: machine.usesCredits
    };
  });
}

/**
 * Beräknar total intäkt från alla maskiner vid standard vs max leasing
 */
export function calculateTotalRevenueDifference(
  exchangeRate: number = 11.49260,
  includeInsurance: boolean = false
): {
  totalStandard: number;
  totalMax: number;
  totalDifference: number;
  averagePercentIncrease: number;
} {
  const analyses = calculateDealerRevenue(exchangeRate, includeInsurance);
  
  const totalStandard = analyses.reduce((sum, item) => sum + item.standardLeasingAmount, 0);
  const totalMax = analyses.reduce((sum, item) => sum + item.maxLeasingAmount, 0);
  const totalDifference = totalMax - totalStandard;
  
  // Genomsnittlig procentuell ökning (endast för maskiner med värde > 0)
  const validItems = analyses.filter(item => item.standardLeasingAmount > 0);
  const averagePercentIncrease = validItems.length > 0
    ? validItems.reduce((sum, item) => sum + item.differencePercent, 0) / validItems.length
    : 0;
  
  return {
    totalStandard,
    totalMax,
    totalDifference,
    averagePercentIncrease
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
    result += `  Använder krediter: ${item.usesCredits ? 'Ja' : 'Nej'}\n\n`;
  });
  
  // Lägga till summering
  const totals = calculateTotalRevenueDifference();
  result += 'SUMMERING\n';
  result += '=========\n';
  result += `Total intäkt med standardleasing: ${formatCurrency(totals.totalStandard)}\n`;
  result += `Total intäkt med max leasing: ${formatCurrency(totals.totalMax)}\n`;
  result += `Total skillnad: ${formatCurrency(totals.totalDifference)} (+${totals.averagePercentIncrease.toFixed(1)}%)\n`;
  
  return result;
}
