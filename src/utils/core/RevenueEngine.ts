/**
 * Centraliserad intäkts- och lönsamhetsberäkning
 */

import { VAT_RATE, WORKING_DAYS_PER_MONTH, MONTHS_PER_YEAR } from '../constants';

export interface RevenueData {
  dailyRevenueExVat: number;
  dailyRevenueIncVat: number;
  weeklyRevenueExVat: number;
  weeklyRevenueIncVat: number;
  monthlyRevenueExVat: number;
  monthlyRevenueIncVat: number;
  yearlyRevenueExVat: number;
  yearlyRevenueIncVat: number;
}

export interface NetResultData {
  netPerMonthExVat: number;
  netPerYearExVat: number;
}

export interface OccupancyData {
  occupancy50: number;
  occupancy75: number;
  occupancy100: number;
}

export class RevenueEngine {
  /**
   * Beräknar alla intäktsrelaterade värden
   */
  static calculateRevenue(treatmentsPerDay: number, customerPrice: number): RevenueData {
    const dailyRevenueIncVat = treatmentsPerDay * customerPrice;
    const dailyRevenueExVat = dailyRevenueIncVat / (1 + VAT_RATE);
    
    const weeklyRevenueIncVat = dailyRevenueIncVat * 5; // 5 arbetsdagar
    const weeklyRevenueExVat = dailyRevenueExVat * 5;
    
    const monthlyRevenueIncVat = dailyRevenueIncVat * WORKING_DAYS_PER_MONTH;
    const monthlyRevenueExVat = dailyRevenueExVat * WORKING_DAYS_PER_MONTH;
    
    const yearlyRevenueIncVat = monthlyRevenueIncVat * MONTHS_PER_YEAR;
    const yearlyRevenueExVat = monthlyRevenueExVat * MONTHS_PER_YEAR;

    return {
      dailyRevenueExVat,
      dailyRevenueIncVat,
      weeklyRevenueExVat,
      weeklyRevenueIncVat,
      monthlyRevenueExVat,
      monthlyRevenueIncVat,
      yearlyRevenueExVat,
      yearlyRevenueIncVat
    };
  }

  /**
   * Beräknar nettoresultat
   */
  static calculateNetResults(
    monthlyRevenueExVat: number,
    yearlyRevenueExVat: number,
    totalMonthlyCostExVat: number
  ): NetResultData {
    const netPerMonthExVat = monthlyRevenueExVat - totalMonthlyCostExVat;
    const netPerYearExVat = netPerMonthExVat * MONTHS_PER_YEAR;

    return {
      netPerMonthExVat,
      netPerYearExVat
    };
  }

  /**
   * Beräknar intäkter vid olika beläggningsgrader
   */
  static calculateOccupancyRevenues(yearlyRevenueIncVat: number): OccupancyData {
    return {
      occupancy50: yearlyRevenueIncVat * 0.5,
      occupancy75: yearlyRevenueIncVat * 0.75,
      occupancy100: yearlyRevenueIncVat
    };
  }

  /**
   * Kombinerad beräkning för alla intäkts- och lönsamhetsdata
   */
  static calculateAll(
    treatmentsPerDay: number, 
    customerPrice: number, 
    totalMonthlyCostExVat: number
  ) {
    const revenue = this.calculateRevenue(treatmentsPerDay, customerPrice);
    const netResults = this.calculateNetResults(
      revenue.monthlyRevenueExVat,
      revenue.yearlyRevenueExVat,
      totalMonthlyCostExVat
    );
    const occupancyRevenues = this.calculateOccupancyRevenues(revenue.yearlyRevenueIncVat);

    return {
      revenue,
      netResults,
      occupancyRevenues
    };
  }
}