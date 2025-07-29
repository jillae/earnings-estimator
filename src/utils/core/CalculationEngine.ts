/**
 * CENTRALISERAD BERÄKNINGSMOTOR
 * 
 * Detta är den enda källan för alla finansiella beräkningar i systemet.
 * Alla hooks ska använda denna motor för att säkerställa konsistens.
 */

import { Machine } from '@/data/machines/types';
import { getExchangeRate } from '../exchangeRateUtils';
import { calculateTariffBasedLeasingMax } from '../leasingTariffUtils';
import { VAT_RATE, WORKING_DAYS_PER_MONTH, MONTHS_PER_YEAR } from '../constants';

// Input-interface för alla beräkningar
export interface CalculationInputs {
  machine: Machine | null;
  treatmentsPerDay: number;
  customerPrice: number;
  paymentOption: 'leasing' | 'cash';
  selectedLeasingPeriodId: string;
  selectedInsuranceId: string;
  selectedSlaLevel: 'Brons' | 'Silver' | 'Guld';
  selectedDriftpaket: 'Bas' | 'Silver' | 'Guld';
  leaseAdjustmentFactor: number;
  useFlatrateOption: 'flatrate' | 'perCredit';
  currentSliderStep: number;
  exchangeRate?: number;
}

// Output-interface för alla resultat
export interface CalculationResults {
  // Maskinpriser
  machinePriceSEK: number;
  cashPriceSEK: number;
  
  // Leasing
  leasingCost: number;
  leasingRange: {
    min: number;
    max: number;
    default: number;
    flatrateThreshold?: number;
  };
  leasingMax60mRef: number;
  
  // Credits och drift
  creditPrice: number;
  operatingCost: {
    costPerMonth: number;
    useFlatrate: boolean;
    slaCost: number;
    totalCost: number;
  };
  
  // Intäkter
  revenue: {
    revenuePerTreatmentExVat: number;
    dailyRevenueIncVat: number;
    weeklyRevenueIncVat: number;
    monthlyRevenueIncVat: number;
    yearlyRevenueIncVat: number;
    monthlyRevenueExVat: number;
    yearlyRevenueExVat: number;
  };
  
  // Nettoresultat
  netResults: {
    netPerMonthExVat: number;
    netPerYearExVat: number;
  };
  
  // Beläggningsgrader
  occupancyRevenues: {
    occupancy50: number;
    occupancy75: number;
    occupancy100: number;
  };
  
  // Metadata
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class CalculationEngine {
  
  /**
   * HUVUDFUNKTION - Beräknar alla värden från input
   */
  static async calculate(inputs: CalculationInputs): Promise<CalculationResults> {
    console.log('🔢 CalculationEngine.calculate() startar med inputs:', inputs);
    
    // Steg 1: Validera input
    const validation = this.validateInputs(inputs);
    if (!validation.isValid) {
      return this.createErrorResult(validation.errors);
    }
    
    // Steg 2: Beräkna växelkurs och maskinpriser
    const exchangeRate = inputs.exchangeRate || await this.getExchangeRate();
    const machinePricing = this.calculateMachinePricing(inputs.machine, exchangeRate);
    
    // Steg 3: Beräkna leasing-värden
    const leasingCalcs = this.calculateLeasing(inputs, machinePricing, exchangeRate);
    
    // Steg 4: Beräkna credit-pris baserat på slider
    const creditPrice = this.calculateCreditPrice(inputs, leasingCalcs);
    
    // Steg 5: Beräkna driftskostnader
    const operatingCost = this.calculateOperatingCosts(inputs, creditPrice, leasingCalcs);
    
    // Steg 6: Beräkna intäkter
    const revenue = this.calculateRevenue(inputs.customerPrice, inputs.treatmentsPerDay);
    
    // Steg 7: Beräkna nettoresultat
    const netResults = this.calculateNetResults(revenue, operatingCost, leasingCalcs.leasingCost, inputs.paymentOption, machinePricing.cashPriceSEK);
    
    // Steg 8: Beräkna beläggningsgrader
    const occupancyRevenues = this.calculateOccupancyRevenues(revenue.yearlyRevenueIncVat);
    
    const result: CalculationResults = {
      machinePriceSEK: machinePricing.machinePriceSEK,
      cashPriceSEK: machinePricing.cashPriceSEK,
      leasingCost: leasingCalcs.leasingCost,
      leasingRange: leasingCalcs.leasingRange,
      leasingMax60mRef: leasingCalcs.leasingMax60mRef,
      creditPrice,
      operatingCost,
      revenue,
      netResults,
      occupancyRevenues,
      isValid: true,
      errors: [],
      warnings: validation.warnings
    };
    
    console.log('✅ CalculationEngine.calculate() slutförd, resultat:', result);
    return result;
  }
  
  /**
   * VALIDERING AV INPUT
   */
  private static validateInputs(inputs: CalculationInputs): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Kritiska valideringar
    if (!inputs.machine) {
      errors.push('Ingen maskin vald');
    }
    
    if (inputs.treatmentsPerDay < 0 || inputs.treatmentsPerDay > 50) {
      errors.push(`Ogiltigt antal behandlingar per dag: ${inputs.treatmentsPerDay}`);
    }
    
    if (inputs.customerPrice <= 0 || inputs.customerPrice > 10000) {
      errors.push(`Ogiltigt kundpris: ${inputs.customerPrice}`);
    }
    
    // Varningar
    if (inputs.treatmentsPerDay === 0) {
      warnings.push('Inga behandlingar per dag - alla intäkter blir 0');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * VÄXELKURS
   */
  private static async getExchangeRate(): Promise<number> {
    try {
      return await getExchangeRate('EUR', 'SEK');
    } catch (error) {
      console.warn('Växelkurs-fel, använder fallback:', error);
      return 11.4926; // Fallback
    }
  }
  
  /**
   * MASKINPRISER
   */
  private static calculateMachinePricing(machine: Machine | null, exchangeRate: number) {
    if (!machine || !machine.priceEur) {
      return { machinePriceSEK: 0, cashPriceSEK: 0 };
    }
    
    const machinePriceSEK = machine.priceEur * exchangeRate;
    const cashPriceSEK = machinePriceSEK; // Samma för kontant
    
    console.log(`Maskinpriser - ${machine.name}: EUR ${machine.priceEur} × ${exchangeRate} = SEK ${machinePriceSEK}`);
    
    return { machinePriceSEK, cashPriceSEK };
  }
  
  /**
   * LEASING-BERÄKNINGAR
   */
  private static calculateLeasing(inputs: CalculationInputs, machinePricing: any, exchangeRate: number) {
    if (!inputs.machine) {
      return {
        leasingCost: 0,
        leasingRange: { min: 0, max: 0, default: 0 },
        leasingMax60mRef: 0
      };
    }
    
    // Beräkna 60-månaders referens (används för SLA-kostnader)
    const leasingMax60mRef = calculateTariffBasedLeasingMax(
      inputs.machine.priceEur || 0,
      60,
      inputs.machine.usesCredits,
      exchangeRate
    );
    
    // Beräkna aktuell leasingkostnad baserat på slider
    // TODO: Implementera slider-logik här
    const leasingCost = leasingMax60mRef; // Tillfälligt
    
    // Beräkna range
    const leasingRange = {
      min: leasingMax60mRef * 0.8,
      max: leasingMax60mRef * 1.2,
      default: leasingMax60mRef,
      flatrateThreshold: leasingMax60mRef * 0.9
    };
    
    console.log(`Leasing för ${inputs.machine.name}: kostnad=${leasingCost}, max60mRef=${leasingMax60mRef}`);
    
    return { leasingCost, leasingRange, leasingMax60mRef };
  }
  
  /**
   * CREDIT-PRIS baserat på slider
   */
  private static calculateCreditPrice(inputs: CalculationInputs, leasingCalcs: any): number {
    if (!inputs.machine || !inputs.machine.usesCredits) {
      return 0;
    }
    
    const creditMin = inputs.machine.creditMin || 149;
    const creditMax = inputs.machine.creditMax || 299;
    
    // Slider från 0 till 2, där:
    // 0 = creditMax (högsta credit-pris, lägsta leasing)
    // 1 = mellan-värde
    // 2 = creditMin (lägsta credit-pris, högsta leasing)
    const sliderPosition = Math.max(0, Math.min(2, inputs.currentSliderStep));
    const creditPrice = creditMax - (sliderPosition / 2) * (creditMax - creditMin);
    
    console.log(`Credit-pris: slider=${sliderPosition}, min=${creditMin}, max=${creditMax}, resultat=${creditPrice}`);
    
    return Math.round(creditPrice);
  }
  
  /**
   * DRIFTSKOSTNADER
   */
  private static calculateOperatingCosts(inputs: CalculationInputs, creditPrice: number, leasingCalcs: any) {
    if (!inputs.machine) {
      return { costPerMonth: 0, useFlatrate: false, slaCost: 0, totalCost: 0 };
    }
    
    let costPerMonth = 0;
    const useFlatrate = inputs.useFlatrateOption === 'flatrate' && Boolean(inputs.machine.flatrateAmount);
    
    if (useFlatrate && inputs.machine.flatrateAmount) {
      // Flatrate-kostnad
      costPerMonth = inputs.machine.flatrateAmount;
    } else if (inputs.machine.usesCredits) {
      // Per-credit kostnad
      const creditsPerTreatment = inputs.machine.creditsPerTreatment || 1;
      const treatmentsPerMonth = inputs.treatmentsPerDay * WORKING_DAYS_PER_MONTH;
      costPerMonth = creditsPerTreatment * treatmentsPerMonth * creditPrice;
    }
    
    // SLA-kostnad baserat på nivå
    let slaCost = 0;
    if (inputs.selectedSlaLevel === 'Silver') {
      slaCost = leasingCalcs.leasingMax60mRef * 0.25; // 25%
    } else if (inputs.selectedSlaLevel === 'Guld') {
      slaCost = leasingCalcs.leasingMax60mRef * 0.50; // 50%
    }
    
    const totalCost = costPerMonth + slaCost;
    
    console.log(`Driftskostnader för ${inputs.machine.name}:
      Credit/Flatrate: ${costPerMonth}
      SLA (${inputs.selectedSlaLevel}): ${slaCost}
      Total: ${totalCost}
    `);
    
    return { costPerMonth, useFlatrate, slaCost, totalCost };
  }
  
  /**
   * INTÄKTSBERÄKNINGAR
   */
  private static calculateRevenue(customerPrice: number, treatmentsPerDay: number) {
    const revenuePerTreatmentExVat = customerPrice / (1 + VAT_RATE);
    const dailyRevenueIncVat = customerPrice * treatmentsPerDay;
    const weeklyRevenueIncVat = dailyRevenueIncVat * 5;
    const monthlyRevenueIncVat = dailyRevenueIncVat * WORKING_DAYS_PER_MONTH;
    const yearlyRevenueIncVat = monthlyRevenueIncVat * MONTHS_PER_YEAR;
    
    const monthlyRevenueExVat = monthlyRevenueIncVat / (1 + VAT_RATE);
    const yearlyRevenueExVat = monthlyRevenueExVat * MONTHS_PER_YEAR;
    
    console.log(`Intäktsberäkning: ${treatmentsPerDay} beh/dag × ${customerPrice} kr = ${monthlyRevenueExVat} kr/mån (ex moms)`);
    
    return {
      revenuePerTreatmentExVat,
      dailyRevenueIncVat,
      weeklyRevenueIncVat,
      monthlyRevenueIncVat,
      yearlyRevenueIncVat,
      monthlyRevenueExVat,
      yearlyRevenueExVat
    };
  }
  
  /**
   * NETTORESULTAT
   */
  private static calculateNetResults(revenue: any, operatingCost: any, leasingCost: number, paymentOption: string, cashPriceSEK: number) {
    let investmentCostPerMonth = 0;
    
    if (paymentOption === 'leasing') {
      investmentCostPerMonth = leasingCost;
    } else {
      // Kontant - sprid över 60 månader
      investmentCostPerMonth = cashPriceSEK / 60;
    }
    
    const totalMonthlyCostExVat = investmentCostPerMonth + operatingCost.totalCost;
    const netPerMonthExVat = revenue.monthlyRevenueExVat - totalMonthlyCostExVat;
    const netPerYearExVat = revenue.yearlyRevenueExVat - (totalMonthlyCostExVat * MONTHS_PER_YEAR);
    
    console.log(`Nettoresultat: ${revenue.monthlyRevenueExVat} - ${totalMonthlyCostExVat} = ${netPerMonthExVat} kr/mån`);
    
    return { netPerMonthExVat, netPerYearExVat };
  }
  
  /**
   * BELÄGGNINGSGRADER
   */
  private static calculateOccupancyRevenues(yearlyRevenueIncVat: number) {
    return {
      occupancy50: yearlyRevenueIncVat * 0.5,
      occupancy75: yearlyRevenueIncVat * 0.75,
      occupancy100: yearlyRevenueIncVat
    };
  }
  
  /**
   * FELHANTERING
   */
  private static createErrorResult(errors: string[]): CalculationResults {
    return {
      machinePriceSEK: 0,
      cashPriceSEK: 0,
      leasingCost: 0,
      leasingRange: { min: 0, max: 0, default: 0 },
      leasingMax60mRef: 0,
      creditPrice: 0,
      operatingCost: { costPerMonth: 0, useFlatrate: false, slaCost: 0, totalCost: 0 },
      revenue: {
        revenuePerTreatmentExVat: 0,
        dailyRevenueIncVat: 0,
        weeklyRevenueIncVat: 0,
        monthlyRevenueIncVat: 0,
        yearlyRevenueIncVat: 0,
        monthlyRevenueExVat: 0,
        yearlyRevenueExVat: 0
      },
      netResults: { netPerMonthExVat: 0, netPerYearExVat: 0 },
      occupancyRevenues: { occupancy50: 0, occupancy75: 0, occupancy100: 0 },
      isValid: false,
      errors,
      warnings: []
    };
  }
}