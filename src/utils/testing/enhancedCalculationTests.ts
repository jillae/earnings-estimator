/**
 * FÖRBÄTTRADE BERÄKNINGSTESTER MED VALIDERING
 * 
 * Omfattande tester för att verifiera att alla finansiella kalkyler är korrekta
 */

import { CalculationEngine } from '../core/CalculationEngine';
import { machineData } from '@/data/machines';
import { validateAll } from '../validation/inputValidation';
import { logger, logCalculation, logValidation } from '../logging/structuredLogger';

interface TestResult {
  testName: string;
  success: boolean;
  errors: string[];
  warnings: string[];
  data?: any;
}

interface TestSuite {
  suiteName: string;
  results: TestResult[];
  overallSuccess: boolean;
}

/**
 * Test för en specifik maskin med kända värden
 */
export async function testMachineCalculations(machineId: string): Promise<TestResult> {
  const testName = `Maskin ${machineId} Beräkningar`;
  logCalculation.start('TestSuite', { testName, machineId });

  try {
    const machine = machineData.find(m => m.id === machineId);
    if (!machine) {
      return {
        testName,
        success: false,
        errors: [`Maskin ${machineId} hittades inte`],
        warnings: []
      };
    }

    // Validera maskindata först
    const machineValidation = validateAll({ machine });
    if (!machineValidation.isValid) {
      logValidation.failure('TestSuite', machineValidation.errors);
      return {
        testName,
        success: false,
        errors: machineValidation.errors,
        warnings: machineValidation.warnings
      };
    }

    // Standardtestparametrar
    const testInputs = {
      machine,
      treatmentsPerDay: 2,
      customerPrice: machine.defaultCustomerPrice || 2500,
      paymentOption: 'leasing' as const,
      selectedLeasingPeriodId: '60',
      selectedInsuranceId: 'none',
      selectedSlaLevel: 'Brons' as const,
      selectedDriftpaket: 'Bas' as const,
      leaseAdjustmentFactor: 1.0,
      useFlatrateOption: 'perCredit' as const,
      currentSliderStep: 1 as const,
      selectedLeasingModel: 'grundleasing' as const,
      exchangeRate: 11.4926,
      workDaysPerMonth: 22
    };

    // Validera input
    const inputValidation = validateAll({
      machine,
      treatmentsPerDay: testInputs.treatmentsPerDay,
      customerPrice: testInputs.customerPrice,
      currentSliderStep: testInputs.currentSliderStep,
      paymentOption: testInputs.paymentOption,
      selectedLeasingModel: 'grundleasing'
    });
    if (!inputValidation.isValid) {
      return {
        testName,
        success: false,
        errors: inputValidation.errors,
        warnings: inputValidation.warnings
      };
    }

    // Kör beräkningen
    const results = await CalculationEngine.calculate(testInputs);

    // Validera resultat
    const resultsValidation = validateAll(
      { machine, selectedLeasingModel: 'grundleasing' },
      results
    );

    const errors: string[] = [];
    const warnings: string[] = [...resultsValidation.warnings];

    // Specifika tester för maskinen
    if (machine.usesCredits) {
      // Test 1: Verifiera att strategisk kostnad använder leasingMax
      if (machine.leasingMax && results.leasingCostStrategic) {
        const deviation = Math.abs(machine.leasingMax - results.leasingCostStrategic) / machine.leasingMax;
        if (deviation > 0.05) {
          errors.push(`Strategisk kostnad avviker för mycket från leasingMax: ${results.leasingCostStrategic} vs förväntad ${machine.leasingMax}`);
        }
      }

      // Test 2: Verifiera credit-priser inom range
      if (machine.creditMin && machine.creditMax) {
        if (results.creditPrice < machine.creditMin * 0.8 || results.creditPrice > machine.creditMax * 1.2) {
          errors.push(`Credit-pris (${results.creditPrice}) utanför förväntat intervall ${machine.creditMin}-${machine.creditMax}`);
        }
      }

      // Test 3: Verifiera att grundkostnad är mindre än strategisk kostnad
      if (results.leasingCostBase && results.leasingCostStrategic) {
        if (results.leasingCostBase >= results.leasingCostStrategic) {
          errors.push(`Grundkostnad (${results.leasingCostBase}) bör vara mindre än strategisk kostnad (${results.leasingCostStrategic})`);
        }
      }
    }

    // Test 4: Verifiera intäktsberäkning
    const expectedRevenue = testInputs.treatmentsPerDay * testInputs.customerPrice * 22; // 22 arbetsdagar
    if (results.revenue?.monthlyRevenueIncVat) {
      const revenueDiff = Math.abs(expectedRevenue - results.revenue.monthlyRevenueIncVat);
      if (revenueDiff > 1000) {
        errors.push(`Intäktsberäkning avviker: ${results.revenue.monthlyRevenueIncVat} vs förväntad ${expectedRevenue}`);
      }
    }

    // Test 5: Verifiera positiva värden
    if (results.machinePriceSEK <= 0) errors.push('Maskinpris SEK är inte positivt');
    if (results.leasingCost <= 0) errors.push('Leasingkostnad är inte positiv');

    const success = errors.length === 0 && resultsValidation.isValid;
    
    if (success) {
      logCalculation.result('TestSuite', { testName, results: 'Success' });
    } else {
      logCalculation.error('TestSuite', { testName, errors });
    }

    return {
      testName,
      success,
      errors: [...resultsValidation.errors, ...errors],
      warnings,
      data: {
        machinePriceSEK: results.machinePriceSEK,
        leasingCostBase: results.leasingCostBase,
        leasingCostStrategic: results.leasingCostStrategic,
        creditPrice: results.creditPrice,
        monthlyRevenue: results.revenue?.monthlyRevenueIncVat,
        netPerMonth: results.netResults?.netPerMonthExVat
      }
    };

  } catch (error) {
    logCalculation.error('TestSuite', { testName, error });
    return {
      testName,
      success: false,
      errors: [`Kritiskt fel: ${error}`],
      warnings: []
    };
  }
}

/**
 * Test för strategisk vs grundleasing prisdifferens
 */
export async function testLeasingModelPricing(): Promise<TestResult> {
  const testName = 'Strategisk vs Grundleasing Prisdifferens';
  logCalculation.start('TestSuite', { testName });

  try {
    const creditMachines = machineData.filter(m => m.usesCredits && m.leasingMax);
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const machine of creditMachines) {
      const testInputs = {
        machine,
        treatmentsPerDay: 2,
        customerPrice: machine.defaultCustomerPrice || 2500,
        paymentOption: 'leasing' as const,
        selectedLeasingPeriodId: '60',
        selectedInsuranceId: 'none',
        selectedSlaLevel: 'Brons' as const,
        selectedDriftpaket: 'Bas' as const,
        leaseAdjustmentFactor: 1.0,
        useFlatrateOption: 'perCredit' as const,
        currentSliderStep: 1,
        selectedLeasingModel: 'grundleasing' as const,
        exchangeRate: 11.4926,
        workDaysPerMonth: 22
      };

      const results = await CalculationEngine.calculate(testInputs);
      
      if (results.leasingCostBase && results.leasingCostStrategic) {
        const difference = results.leasingCostStrategic - results.leasingCostBase;
        const percentIncrease = (difference / results.leasingCostBase) * 100;
        
        logger.info('calculation', `${machine.name}: Grund ${results.leasingCostBase} -> Strategisk ${results.leasingCostStrategic} (+${difference} kr, +${percentIncrease.toFixed(1)}%)`);
        
        // Verifiera rimlig prisskillnad (15-50% ökning är rimligt för credit-kompensation)
        if (percentIncrease < 10) {
          warnings.push(`${machine.name}: Mycket liten prisskillnad (${percentIncrease.toFixed(1)}%)`);
        } else if (percentIncrease > 60) {
          warnings.push(`${machine.name}: Mycket stor prisskillnad (${percentIncrease.toFixed(1)}%)`);
        }
      }
    }

    return {
      testName,
      success: errors.length === 0,
      errors,
      warnings
    };

  } catch (error) {
    return {
      testName,
      success: false,
      errors: [`Kritiskt fel: ${error}`],
      warnings: []
    };
  }
}

/**
 * Test för alla maskiner - grundläggande validering
 */
export async function testAllMachinesBasic(): Promise<TestResult> {
  const testName = 'Alla Maskiner - Grundvalidering';
  logCalculation.start('TestSuite', { testName });

  const errors: string[] = [];
  const warnings: string[] = [];
  let testedCount = 0;

  for (const machine of machineData) {
    try {
      const machineValidation = validateAll({ machine });
      
      if (!machineValidation.isValid) {
        errors.push(`${machine.name}: ${machineValidation.errors.join(', ')}`);
      }
      
      if (machineValidation.warnings.length > 0) {
        warnings.push(`${machine.name}: ${machineValidation.warnings.join(', ')}`);
      }
      
      testedCount++;
    } catch (error) {
      errors.push(`${machine.name}: Kritiskt fel - ${error}`);
    }
  }

  logger.info('calculation', `Testade ${testedCount} maskiner`, { errors: errors.length, warnings: warnings.length });

  return {
    testName,
    success: errors.length === 0,
    errors,
    warnings,
    data: { testedCount }
  };
}

/**
 * Huvudtestfunktion som kör alla tester
 */
export async function runAllTests(): Promise<TestSuite> {
  logger.info('system', '🧪 === STARTAR FÖRBÄTTRADE BERÄKNINGSTESTER ===');
  
  const results: TestResult[] = [];

  // Test 1: Grundvalidering av alla maskiner
  results.push(await testAllMachinesBasic());

  // Test 2: Detaljerade tester för viktiga maskiner
  const importantMachines = ['emerald', 'zerona', 'fx-635', 'fx-405'];
  for (const machineId of importantMachines) {
    results.push(await testMachineCalculations(machineId));
  }

  // Test 3: Prisdifferens mellan leasingmodeller
  results.push(await testLeasingModelPricing());

  const overallSuccess = results.every(r => r.success);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  logger.info('system', `🎯 TESTRESULTAT: ${overallSuccess ? 'GODKÄNT' : 'MISSLYCKADES'}`, {
    totalTests: results.length,
    successful: results.filter(r => r.success).length,
    errors: totalErrors,
    warnings: totalWarnings
  });

  // Logga detaljerade resultat
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.testName}`);
    
    if (result.errors.length > 0) {
      console.log(`   Fel: ${result.errors.join('; ')}`);
    }
    
    if (result.warnings.length > 0) {
      console.log(`   Varningar: ${result.warnings.join('; ')}`);
    }
  });

  return {
    suiteName: 'Förbättrade Beräkningstester',
    results,
    overallSuccess
  };
}

/**
 * Testfunktion för specifik leasingmodell-kombination
 */
export async function testLeasingModelScenario(
  machineId: string,
  selectedLeasingModel: 'grundleasing' | 'strategisk',
  treatments: number = 2
): Promise<TestResult> {
  const testName = `${machineId} - ${selectedLeasingModel} (${treatments} beh/dag)`;
  
  try {
    const machine = machineData.find(m => m.id === machineId);
    if (!machine) {
      return {
        testName,
        success: false,
        errors: [`Maskin ${machineId} hittades inte`],
        warnings: []
      };
    }

    const testInputs = {
      machine,
      treatmentsPerDay: treatments,
      customerPrice: machine.defaultCustomerPrice || 2500,
      paymentOption: 'leasing' as const,
      selectedLeasingPeriodId: '60',
      selectedInsuranceId: 'none',
      selectedSlaLevel: 'Brons' as const,
      selectedDriftpaket: 'Bas' as const,
      leaseAdjustmentFactor: 1.0,
      useFlatrateOption: 'perCredit' as const,
      currentSliderStep: selectedLeasingModel === 'grundleasing' ? 1 : 2,
      selectedLeasingModel: selectedLeasingModel,
      exchangeRate: 11.4926,
      workDaysPerMonth: 22
    };

    const results = await CalculationEngine.calculate(testInputs);
    
    // Validera att rätt kostnad används baserat på leasingmodell
    let expectedLeasingCost: number;
    if (selectedLeasingModel === 'strategisk' && machine.leasingMax) {
      expectedLeasingCost = machine.leasingMax;
    } else {
      expectedLeasingCost = results.leasingCostBase;
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Kontrollera kostnadskonsistens
    const actualCost = selectedLeasingModel === 'strategisk' ? results.leasingCostStrategic : results.leasingCost;
    if (actualCost && Math.abs(actualCost - expectedLeasingCost) > 100) {
      errors.push(`Kostnad inte konsistent: Förväntad ${expectedLeasingCost}, fick ${actualCost}`);
    }

    return {
      testName,
      success: errors.length === 0,
      errors,
      warnings,
      data: {
        leasingModel: selectedLeasingModel,
        expectedCost: expectedLeasingCost,
        actualCost,
        creditPrice: results.creditPrice,
        netPerMonth: results.netResults?.netPerMonthExVat
      }
    };

  } catch (error) {
    return {
      testName,
      success: false,
      errors: [`Kritiskt fel: ${error}`],
      warnings: []
    };
  }
}