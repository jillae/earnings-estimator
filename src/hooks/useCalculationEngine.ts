/**
 * FÖRENKLAD HOOK SOM ANVÄNDER DEN CENTRALISERADE BERÄKNINGSMOTORN
 * 
 * Denna hook ersätter den komplexa kedjan av useCalculatorValues → useLeasingCalculations 
 * → useOperatingCosts → useRevenueCalculations med en enda, pålitlig källa.
 */

import { useState, useEffect, useCallback } from 'react';
import { CalculationEngine, CalculationInputs, CalculationResults } from '@/utils/core/CalculationEngine';
import { Machine } from '@/data/machines/types';

interface UseCalculationEngineProps {
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
  workDaysPerMonth: number;
}

export function useCalculationEngine(props: UseCalculationEngineProps) {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastCalculation, setLastCalculation] = useState<string>('');

  // Skapa en stabil referens för inputs för att undvika onödiga omberäkningar
  const createInputs = useCallback((): CalculationInputs => {
    return {
      machine: props.machine,
      treatmentsPerDay: props.treatmentsPerDay,
      customerPrice: props.customerPrice,
      paymentOption: props.paymentOption,
      selectedLeasingPeriodId: props.selectedLeasingPeriodId,
      selectedInsuranceId: props.selectedInsuranceId,
      selectedSlaLevel: props.selectedSlaLevel,
      selectedDriftpaket: props.selectedDriftpaket,
      leaseAdjustmentFactor: props.leaseAdjustmentFactor,
      useFlatrateOption: props.useFlatrateOption,
      currentSliderStep: props.currentSliderStep,
      
      exchangeRate: props.exchangeRate,
      workDaysPerMonth: props.workDaysPerMonth
    };
  }, [
    props.machine?.id, // Bara ID för att undvika djupa jämförelser
    props.treatmentsPerDay,
    props.customerPrice,
    props.paymentOption,
    props.selectedLeasingPeriodId,
    props.selectedInsuranceId,
    props.selectedSlaLevel,
    props.selectedDriftpaket,
    props.leaseAdjustmentFactor,
    props.useFlatrateOption,
    props.currentSliderStep,
    
    props.exchangeRate,
    props.workDaysPerMonth
  ]);

  // Huvudberäkning
  const calculate = useCallback(async () => {
    const inputs = createInputs();
    
    // KRITISKT: Kör inte beräkningar om ingen maskin är vald
    if (!inputs.machine) {
      setResults(null);
      setIsCalculating(false);
      return;
    }
    
    // Undvik dubbelberäkningar genom att kolla om inputs har ändrats
    const inputHash = JSON.stringify(inputs);
    if (inputHash === lastCalculation) {
      return;
    }

    setIsCalculating(true);

    try {
      const newResults = await CalculationEngine.calculate(inputs);
      
      if (!newResults.isValid) {
        console.error('❌ Beräkningsfel:', newResults.errors);
      }
      setResults(newResults);
      setLastCalculation(inputHash);
    } catch (error) {
      
      // Skapa ett felresultat
      const errorResult: CalculationResults = {
        machinePriceSEK: 0,
        cashPriceSEK: 0,
        leasingCostBase: 0,
        leasingCostStrategic: 0,
        leasingCost: 0,
        leasingRange: { min: 0, max: 0, default: 0, baseMax: 0, strategicMax: 0 },
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
        errors: [`Kritiskt fel: ${error instanceof Error ? error.message : 'Okänt fel'}`],
        warnings: []
      };
      
      setResults(errorResult);
    } finally {
      setIsCalculating(false);
    }
  }, [createInputs, lastCalculation]);

  // Kör beräkning när inputs ändras
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Force-update funktion för manuell omberäkning
  const forceRecalculate = useCallback(() => {
    setLastCalculation(''); // Rensa cache
    calculate();
  }, [calculate]);

  // Returnera standardvärden om ingen beräkning är klar än
  const safeResults: CalculationResults = results || {
    machinePriceSEK: 0,
    cashPriceSEK: 0,
    leasingCostBase: 0,
    leasingCostStrategic: 0,
    leasingCost: 0,
    leasingRange: { min: 0, max: 0, default: 0, baseMax: 0, strategicMax: 0 },
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
    errors: ['Väntar på beräkning...'],
    warnings: []
  };

  return {
    // Huvudresultat
    ...safeResults,
    
    // Metadata
    isCalculating,
    hasValidResults: safeResults.isValid,
    
    // Funktioner
    forceRecalculate,
    
    // Bakåtkompatibilitet - mappar nya strukturen till gamla namnen
    selectedMachine: props.machine,
    exchangeRate: props.exchangeRate || 11.4926,
    machinePriceSEK: safeResults.machinePriceSEK,
    leasingRange: safeResults.leasingRange,
    leasingCost: safeResults.leasingCost,
    creditPrice: safeResults.creditPrice,
    calculatedCreditPrice: safeResults.creditPrice,
    operatingCost: safeResults.operatingCost,
    revenue: safeResults.revenue,
    netResults: safeResults.netResults,
    occupancyRevenues: safeResults.occupancyRevenues,
    flatrateThreshold: safeResults.leasingRange.flatrateThreshold || 0,
    cashPriceSEK: safeResults.cashPriceSEK,
    leasingStandardRef: safeResults.leasingStandardRef
  };
}