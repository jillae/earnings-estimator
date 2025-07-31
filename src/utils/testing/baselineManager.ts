/**
 * BASELINE MANAGEMENT SYSTEM
 * 
 * Skapar och hanterar baselines för kalkylatorns beräkningsresultat.
 * Används för regressionstestning och kvalitetssäkring.
 */

import { CalculationEngine, CalculationInputs } from '../core/CalculationEngine';
import { machineData } from '@/data/machines';
import { runAllTests } from './enhancedCalculationTests';
import { testCalculations, testAllMachines } from './calculationTests';
import { logger } from '../logging/structuredLogger';

export interface BaselineTestCase {
  name: string;
  inputs: CalculationInputs;
  expectedOutputs?: any; // För framtida jämförelser
}

export interface BaselineResults {
  metadata: {
    timestamp: string;
    version: string;
    testCases: number;
    environment: string;
  };
  testResults: {
    enhanced: any;
    legacy: any;
  };
  detailedCalculations: Array<{
    testCase: BaselineTestCase;
    results: any;
    success: boolean;
    errors: string[];
  }>;
  summary: {
    totalTests: number;
    successful: number;
    failed: number;
    totalErrors: number;
    totalWarnings: number;
  };
}

/**
 * Genererar testfall för alla viktiga scenarion
 */
function generateTestCases(): BaselineTestCase[] {
  const testCases: BaselineTestCase[] = [];
  
  // Viktiga maskiner att testa
  const importantMachines = machineData.filter(m => 
    ['emerald', 'zerona', 'fx-635', 'fx-405', 'gvl', 'evrl'].includes(m.id)
  );
  
  // Olika leasingperioder att testa
  const leasingPeriods = ['36', '48', '60'];
  
  // Olika försäkringsalternativ
  const insuranceOptions = ['yes', 'no'];
  
  // Olika SLA-nivåer
  const slaLevels: Array<'Brons' | 'Silver' | 'Guld'> = ['Brons', 'Silver', 'Guld'];
  
  // Olika behandlingsvolymer
  const treatmentVolumes = [2, 4, 6, 8];
  
  // Olika slidersteg för grundleasing
  const sliderSteps = [0, 1, 2];
  
  // Olika leasingmodeller
  const leasingModels: Array<'hybridmodell' | 'strategimodell'> = ['hybridmodell', 'strategimodell'];

  for (const machine of importantMachines) {
    for (const leasingPeriod of leasingPeriods) {
      for (const insurance of insuranceOptions) {
        for (const slaLevel of slaLevels) {
          for (const treatments of treatmentVolumes) {
            for (const leasingModel of leasingModels) {
              // För grundleasing, testa olika slidersteg
              const stepsToTest = leasingModel === 'hybridmodell' ? sliderSteps : [1];
              
              for (const sliderStep of stepsToTest) {
                testCases.push({
                  name: `${machine.name}_${leasingPeriod}m_${insurance}ins_${slaLevel}_${treatments}beh_${leasingModel}_step${sliderStep}`,
                  inputs: {
                    machine: machine,
                    treatmentsPerDay: treatments,
                    customerPrice: machine.defaultCustomerPrice || 2500,
                    paymentOption: 'leasing',
                    selectedLeasingPeriodId: leasingPeriod,
                    selectedInsuranceId: insurance,
                    selectedSlaLevel: slaLevel,
                    selectedDriftpaket: slaLevel === 'Brons' ? 'Bas' : slaLevel,
                    leaseAdjustmentFactor: 0.5,
                    useFlatrateOption: slaLevel === 'Brons' ? 'perCredit' : 'flatrate',
                    currentSliderStep: sliderStep,
                    selectedLeasingModel: leasingModel,
                    workDaysPerMonth: 22
                  }
                });
              }
            }
          }
        }
      }
    }
  }
  
  // Lägg till några kontantbetalnings-testfall
  for (const machine of importantMachines.slice(0, 2)) {
    testCases.push({
      name: `${machine.name}_cash_payment`,
      inputs: {
        machine: machine,
        treatmentsPerDay: 4,
        customerPrice: machine.defaultCustomerPrice || 2500,
        paymentOption: 'cash',
        selectedLeasingPeriodId: '60',
        selectedInsuranceId: 'no',
        selectedSlaLevel: 'Brons',
        selectedDriftpaket: 'Bas',
        leaseAdjustmentFactor: 0.5,
        useFlatrateOption: 'perCredit',
        currentSliderStep: 1,
        selectedLeasingModel: 'hybridmodell',
        workDaysPerMonth: 22
      }
    });
  }

  return testCases;
}

/**
 * Kör omfattande tester och skapar baseline
 */
export async function createBaseline(): Promise<BaselineResults> {
  logger.info('system', '🏁 SKAPAR OMFATTANDE BASELINE', { startTime: new Date().toISOString() });
  
  const startTime = Date.now();
  
  // Kör befintliga testsviter
  console.log('\n🧪 === KÖR FÖRBÄTTRADE TESTER ===');
  const enhancedTestResults = await runAllTests();
  
  console.log('\n🧪 === KÖR ÄLDRE TESTER ===');
  const emeraldResults = await testCalculations();
  const allMachinesResults = await testAllMachines();
  
  // Generera och kör detaljerade testfall
  console.log('\n🧪 === KÖR DETALJERADE BASELINE-TESTER ===');
  const testCases = generateTestCases();
  const detailedResults = [];
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    
    if (i % 50 === 0) {
      console.log(`Progress: ${i}/${testCases.length} testfall completed...`);
    }
    
    try {
      const results = await CalculationEngine.calculate(testCase.inputs);
      
      const success = results.isValid && results.errors.length === 0;
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      detailedResults.push({
        testCase,
        results: {
          // Viktigaste resultat för jämförelser
          leasingCost: results.leasingCost,
          leasingCostBase: results.leasingCostBase,
          leasingCostStrategic: results.leasingCostStrategic,
          creditPrice: results.creditPrice,
          operatingCost: results.operatingCost,
          revenue: results.revenue,
          netResults: results.netResults,
          occupancyRevenues: results.occupancyRevenues,
          machinePriceSEK: results.machinePriceSEK,
          cashPriceSEK: results.cashPriceSEK,
          exchangeRate: 11.4926, // Normalisera för jämförelser
          isValid: results.isValid,
          leasingRange: results.leasingRange
        },
        success,
        errors: results.errors
      });
      
    } catch (error) {
      failCount++;
      detailedResults.push({
        testCase,
        results: null,
        success: false,
        errors: [`Kritiskt fel: ${error}`]
      });
    }
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  const baseline: BaselineResults = {
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0.0', // Kan uppdateras baserat på systemversion
      testCases: testCases.length,
      environment: 'production'
    },
    testResults: {
      enhanced: enhancedTestResults,
      legacy: {
        emerald: emeraldResults,
        allMachines: allMachinesResults
      }
    },
    detailedCalculations: detailedResults,
    summary: {
      totalTests: testCases.length,
      successful: successCount,
      failed: failCount,
      totalErrors: detailedResults.reduce((sum, r) => sum + r.errors.length, 0),
      totalWarnings: 0 // Kan utökas om warnings implementeras
    }
  };
  
  // Logga sammanfattning
  logger.info('system', '🎯 BASELINE SKAPAD', {
    duration: `${duration}ms`,
    totalTests: baseline.summary.totalTests,
    successful: baseline.summary.successful,
    failed: baseline.summary.failed,
    successRate: `${((baseline.summary.successful / baseline.summary.totalTests) * 100).toFixed(1)}%`
  });
  
  console.log(`\n🎯 === BASELINE FÄRDIG ===`);
  console.log(`📊 Total tid: ${(duration / 1000).toFixed(1)}s`);
  console.log(`📈 Testfall: ${baseline.summary.totalTests}`);
  console.log(`✅ Lyckade: ${baseline.summary.successful}`);
  console.log(`❌ Misslyckade: ${baseline.summary.failed}`);
  console.log(`📊 Framgångsgrad: ${((baseline.summary.successful / baseline.summary.totalTests) * 100).toFixed(1)}%`);
  
  return baseline;
}

/**
 * Sparar baseline till fil (för export)
 */
export function exportBaseline(baseline: BaselineResults): string {
  const timestamp = baseline.metadata.timestamp.split('T')[0];
  const filename = `baseline_results_${timestamp}.json`;
  
  // Skapa exportbar data
  const exportData = {
    ...baseline,
    exportInfo: {
      exportedAt: new Date().toISOString(),
      fileFormat: 'baseline-v1',
      description: 'Kalkylator baseline för regressionstestning'
    }
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Jämför två baselines (för framtida implementering)
 */
export function compareBaselines(current: BaselineResults, reference: BaselineResults): any {
  // Placeholder för framtida jämförelsefunktionalitet
  return {
    summary: 'Jämförelsefunktion kan implementeras senare',
    differences: [],
    recommendations: []
  };
}