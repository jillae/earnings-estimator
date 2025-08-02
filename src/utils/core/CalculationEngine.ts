/**
 * CENTRALISERAD BERÄKNINGSMOTOR
 * 
 * Detta är den enda källan för alla finansiella beräkningar i systemet.
 * Alla hooks ska använda denna motor för att säkerställa konsistens.
 */

import { Machine } from '@/data/machines/types';
import { CalculatorMachine } from '@/hooks/useMachineData';
import { getExchangeRate } from '../exchangeRateUtils';
import { calculateTariffBasedLeasingMax } from '../leasingTariffUtils';
import { roundToHundredEndingSix } from '../formatUtils';
import { VAT_RATE, WORKING_DAYS_PER_MONTH, MONTHS_PER_YEAR } from '../constants';

// Input-interface för alla beräkningar
export interface CalculationInputs {
  machine: Machine | CalculatorMachine;
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
  workDaysPerMonth: number;
}

// Output-interface för alla resultat
export interface CalculationResults {
  // Maskinpriser
  machinePriceSEK: number;
  cashPriceSEK: number;
  
  // Leasing (både grundkostnad och strategisk prissättning)
  leasingCostBase: number;        // Tariff-baserad grundkostnad
  leasingCostStrategic: number;   // Strategisk prissättning med credit-kompensation
  leasingCost: number;            // Aktiv kostnad (base eller strategic beroende på inställning)
  leasingRange: {
    min: number;
    max: number;
    default: number;
    flatrateThreshold?: number;
    baseMax?: number;           // Tariff-baserad max
    strategicMax?: number;      // Strategisk max från maskindata
  };
  leasingStandardRef: number;     // Referensvärde för standard leasing (används för SLA-beräkningar)
  
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
    console.log(`BERÄKNAR FÖR MASKIN: ${inputs.machine?.name}, Period: ${inputs.selectedLeasingPeriodId}, SLA: ${inputs.selectedSlaLevel}`);
    
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
    
    console.log(`[TRACKER] CalculationEngine - Key values for occupancy:
      customerPrice: ${inputs.customerPrice}
      treatmentsPerDay: ${inputs.treatmentsPerDay}
      currentSliderStep: ${inputs.currentSliderStep}
      leasingCost: ${leasingCalcs.leasingCost}
      yearlyRevenueIncVat: ${revenue.yearlyRevenueIncVat}
      netPerYearExVat: ${netResults.netPerYearExVat}
    `);
    
    // Steg 8: Beräkna beläggningsgrader - BRUTTOINTÄKTER vid olika kapaciteter
    const occupancyRevenues = this.calculateOccupancyRevenues(revenue.yearlyRevenueIncVat);
    
    const result: CalculationResults = {
      machinePriceSEK: machinePricing.machinePriceSEK,
      cashPriceSEK: machinePricing.cashPriceSEK,
      leasingCostBase: leasingCalcs.leasingCostBase,
      leasingCostStrategic: leasingCalcs.leasingCostStrategic,
      leasingCost: leasingCalcs.leasingCost,
      leasingRange: leasingCalcs.leasingRange,
      leasingStandardRef: leasingCalcs.leasingStandardRef,
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
    const cashPriceSEK = roundToHundredEndingSix(machinePriceSEK); // Avrunda till hundra slutande på 6
    
    console.log(`Maskinpriser - ${machine.name}: EUR ${machine.priceEur} × ${exchangeRate} = SEK ${Math.round(machinePriceSEK)} (kontant: ${cashPriceSEK})`);
    
    return { machinePriceSEK, cashPriceSEK };
  }
  
  /**
   * LEASING-BERÄKNINGAR (Strategisk 5-stegs modell)
   */
  private static calculateLeasing(inputs: CalculationInputs, machinePricing: any, exchangeRate: number) {
    if (!inputs.machine) {
      return {
        leasingCostBase: 0,
        leasingCostStrategic: 0,
        leasingCost: 0,
        leasingRange: { min: 0, max: 0, default: 0, baseMax: 0, strategicMax: 0, flatrateThreshold: 0 },
        leasingStandardRef: 0,
        flatrateThreshold: 0
      };
    }
    
    // För maskiner med strategisk prissättning, använd direkt från maskindata
    if (inputs.machine.usesCredits && inputs.machine.leasingMin && inputs.machine.leasingStandard && inputs.machine.leasingMax) {
      
      // Använd värdena direkt från maskindata enligt den strategiska modellen
      const leasingRange = {
        min: inputs.machine.leasingMin,
        max: inputs.machine.leasingMax,
        default: inputs.machine.leasingStandard,
        flatrateThreshold: inputs.machine.flatrateAmount || 0,
        baseMax: inputs.machine.leasingStandard,
        strategicMax: inputs.machine.leasingMax
      };
      
      // Använd PiecewiseLinearCalculator för att få exakt värde för aktuell slider-position
      const { PiecewiseLinearCalculator } = require('./PiecewiseLinearCalculator');
      
      const pricingData = {
        leasingMin: inputs.machine.leasingMin,
        leasingStandard: inputs.machine.leasingStandard,
        leasingMax: inputs.machine.leasingMax,
        creditMax: inputs.machine.creditMax || 299,
        creditMid1: inputs.machine.creditMid1 || 224,
        creditMid2: inputs.machine.creditMid2 || 149,
        creditMid3: inputs.machine.creditMid3 || 75
      };
      
      const calculator = new PiecewiseLinearCalculator(pricingData);
      const interpolatedValues = calculator.interpolate(inputs.currentSliderStep);
      
      console.log(`STRATEGISK PRISSÄTTNING för ${inputs.machine.name}:
        Slider Step: ${inputs.currentSliderStep}
        Interpolated Leasing: ${interpolatedValues.leasingCost} SEK/mån
        Interpolated Credit: ${interpolatedValues.creditPrice} kr/credit
        Range: ${leasingRange.min} - ${leasingRange.max} SEK/mån
      `);
      
      return { 
        leasingCostBase: inputs.machine.leasingStandard,
        leasingCostStrategic: inputs.machine.leasingMax, 
        leasingCost: interpolatedValues.leasingCost, 
        leasingRange, 
        leasingStandardRef: inputs.machine.leasingStandard,
        flatrateThreshold: leasingRange.flatrateThreshold || 0
      };
    }

    // Fallback för maskiner utan strategisk prissättning (handhållna maskiner)
    const leaseDurationMonths = parseInt(inputs.selectedLeasingPeriodId);
    
    let leasingCostBase = calculateTariffBasedLeasingMax(
      inputs.machine.priceEur || 0,
      leaseDurationMonths,
      inputs.machine.usesCredits,
      exchangeRate
    );
    
    // Lägg till försäkring om vald
    if (inputs.selectedInsuranceId === 'yes') {
      const machinePriceSEK = (inputs.machine.priceEur || 0) * exchangeRate;
      
      let insuranceRate: number;
      if (machinePriceSEK <= 100000) {
        insuranceRate = 0.04;
      } else if (machinePriceSEK <= 200000) {
        insuranceRate = 0.03;
      } else if (machinePriceSEK <= 500000) {
        insuranceRate = 0.025;
      } else {
        insuranceRate = 0.015;
      }
      
      const insuranceCostPerMonth = machinePriceSEK * insuranceRate / 12;
      leasingCostBase += insuranceCostPerMonth;
    }
    
    const leasingRange = {
      min: leasingCostBase * 0.9,
      max: leasingCostBase * 1.1,
      default: leasingCostBase,
      flatrateThreshold: 0,
      baseMax: leasingCostBase,
      strategicMax: leasingCostBase
    };
    
    console.log(`FALLBACK PRISSÄTTNING för ${inputs.machine.name}:
      Grundkostnad: ${leasingCostBase} SEK/mån
      Range: ${leasingRange.min} - ${leasingRange.max} SEK/mån
    `);
    
    return { 
      leasingCostBase,
      leasingCostStrategic: leasingCostBase, 
      leasingCost: leasingCostBase, 
      leasingRange, 
      leasingStandardRef: leasingCostBase,
      flatrateThreshold: 0
    };
  }
  
  /**
   * CREDIT-PRIS baserat på strategisk 5-stegs slider
   */
  private static calculateCreditPrice(inputs: CalculationInputs, leasingCalcs: any): number {
    if (!inputs.machine || !inputs.machine.usesCredits) {
      return 0;
    }
    
    // För maskiner med strategisk prissättning, använd PiecewiseLinearCalculator
    if (inputs.machine.leasingMin && inputs.machine.leasingStandard && inputs.machine.leasingMax) {
      const { PiecewiseLinearCalculator } = require('./PiecewiseLinearCalculator');
      
      const pricingData = {
        leasingMin: inputs.machine.leasingMin,
        leasingStandard: inputs.machine.leasingStandard,
        leasingMax: inputs.machine.leasingMax,
        creditMax: inputs.machine.creditMax || 299,
        creditMid1: inputs.machine.creditMid1 || 224,
        creditMid2: inputs.machine.creditMid2 || 149,
        creditMid3: inputs.machine.creditMid3 || 75
      };
      
      const calculator = new PiecewiseLinearCalculator(pricingData);
      const interpolatedValues = calculator.interpolate(inputs.currentSliderStep);
      
      console.log(`STRATEGISK CREDIT-PRIS för ${inputs.machine.name}:
        Slider Step: ${inputs.currentSliderStep}
        Interpolated Credit: ${interpolatedValues.creditPrice} kr/credit
      `);
      
      return Math.round(interpolatedValues.creditPrice);
    }
    
    // Fallback för gamla maskiner
    const creditMin = inputs.machine.creditMin || 149;
    const creditMax = inputs.machine.creditMax || 299;
    
    const sliderPosition = Math.max(0, Math.min(4, inputs.currentSliderStep));
    const creditPrice = creditMax - (sliderPosition / 4) * (creditMax - creditMin);
    
    console.log(`FALLBACK Credit-pris: slider=${sliderPosition}, min=${creditMin}, max=${creditMax}, resultat=${creditPrice}`);
    
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
       // Flatrate-kostnad med SLA-rabatt
       let flatrateCost = inputs.machine.flatrateAmount;
       
       // Applicera SLA-rabatt på Flatrate Credits
       if (inputs.selectedSlaLevel === 'Silver') {
         flatrateCost = flatrateCost * 0.5; // 50% rabatt för Silver
       } else if (inputs.selectedSlaLevel === 'Guld') {
         flatrateCost = 0; // 100% rabatt (gratis) för Guld
       }
       
       costPerMonth = flatrateCost;
     } else if (inputs.machine.usesCredits) {
       // Per-credit kostnad
       const creditsPerTreatment = inputs.machine.creditsPerTreatment || 1;
       const treatmentsPerMonth = inputs.treatmentsPerDay * WORKING_DAYS_PER_MONTH;
       costPerMonth = creditsPerTreatment * treatmentsPerMonth * creditPrice;
     }
     
    // SLA-kostnad baserat på nivå - SKA ALLTID användas tariff-baserad grundkostnad för SLA-beräkningar
    let slaCost = 0;
    const slaBaseValue = leasingCalcs.leasingCostBase; // Använd ALLTID grundkostnad för SLA-beräkningar
    if (inputs.selectedSlaLevel === 'Silver') {
      slaCost = Math.round(slaBaseValue * 0.25); // 25% av grundkostnad
    } else if (inputs.selectedSlaLevel === 'Guld') {
      slaCost = Math.round(slaBaseValue * 0.50); // 50% av grundkostnad
    }
     
     const totalCost = costPerMonth + slaCost;
     
     console.log(`Driftskostnader för ${inputs.machine.name}:
       Credit/Flatrate (med SLA-rabatt): ${costPerMonth}
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
   * BELÄGGNINGSGRADER - BRUTTOINTÄKTER vid olika kapacitetsgrader
   */
  private static calculateOccupancyRevenues(yearlyRevenueIncVat: number) {
    console.log(`[TRACKER] calculateOccupancyRevenues called with:
      yearlyRevenueIncVat: ${yearlyRevenueIncVat}
    `);
    
    const result = {
      occupancy50: yearlyRevenueIncVat * 0.5,
      occupancy75: yearlyRevenueIncVat * 0.75,
      occupancy100: yearlyRevenueIncVat
    };
    
    console.log(`[TRACKER] Calculated occupancy values (gross revenue):
      50%: ${result.occupancy50}
      75%: ${result.occupancy75}  
      100%: ${result.occupancy100}
    `);
    
    return result;
  }
  
  /**
   * FELHANTERING
   */
  private static createErrorResult(errors: string[]): CalculationResults {
    return {
      machinePriceSEK: 0,
      cashPriceSEK: 0,
      leasingCostBase: 0,
      leasingCostStrategic: 0,
      leasingCost: 0,
      leasingRange: { min: 0, max: 0, default: 0, baseMax: 0, strategicMax: 0, flatrateThreshold: 0 },
      leasingStandardRef: 0,
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