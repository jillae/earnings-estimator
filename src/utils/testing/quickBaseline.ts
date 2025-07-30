/**
 * SNABB BASELINE-TEST
 * 
 * En förkortad version av baseline-systemet för snabb verifiering
 */

import { CalculationEngine, CalculationInputs } from '../core/CalculationEngine';
import { machineData } from '@/data/machines';

export async function runQuickBaseline() {
  console.log('🚀 === SNABB BASELINE-TEST STARTAR ===');
  
  const startTime = Date.now();
  
  // Testa de viktigaste scenarierna
  const quickTests: Array<{ name: string; inputs: CalculationInputs }> = [
    // Emerald - Grundleasing - Standard
    {
      name: 'Emerald_Standard_Grundleasing',
      inputs: {
        machine: machineData.find(m => m.id === 'emerald')!,
        treatmentsPerDay: 4,
        customerPrice: 2500,
        paymentOption: 'leasing',
        selectedLeasingPeriodId: '60',
        selectedInsuranceId: 'no',
        selectedSlaLevel: 'Brons',
        selectedDriftpaket: 'Bas',
        leaseAdjustmentFactor: 0.5,
        useFlatrateOption: 'perCredit',
        currentSliderStep: 1,
        selectedLeasingModel: 'grundleasing',
        workDaysPerMonth: 22
      }
    },
    
    // Emerald - Strategisk
    {
      name: 'Emerald_Strategisk',
      inputs: {
        machine: machineData.find(m => m.id === 'emerald')!,
        treatmentsPerDay: 4,
        customerPrice: 2500,
        paymentOption: 'leasing',
        selectedLeasingPeriodId: '60',
        selectedInsuranceId: 'no',
        selectedSlaLevel: 'Guld',
        selectedDriftpaket: 'Guld',
        leaseAdjustmentFactor: 0.5,
        useFlatrateOption: 'flatrate',
        currentSliderStep: 1,
        selectedLeasingModel: 'strategisk',
        workDaysPerMonth: 22
      }
    },
    
    // Test med försäkring och annan leasingperiod
    {
      name: 'Emerald_36m_Försäkring',
      inputs: {
        machine: machineData.find(m => m.id === 'emerald')!,
        treatmentsPerDay: 6,
        customerPrice: 2500,
        paymentOption: 'leasing',
        selectedLeasingPeriodId: '36',
        selectedInsuranceId: 'yes',
        selectedSlaLevel: 'Silver',
        selectedDriftpaket: 'Silver',
        leaseAdjustmentFactor: 0.5,
        useFlatrateOption: 'flatrate',
        currentSliderStep: 1,
        selectedLeasingModel: 'grundleasing',
        workDaysPerMonth: 22
      }
    },
    
    // Kontantbetalning
    {
      name: 'Emerald_Kontant',
      inputs: {
        machine: machineData.find(m => m.id === 'emerald')!,
        treatmentsPerDay: 4,
        customerPrice: 2500,
        paymentOption: 'cash',
        selectedLeasingPeriodId: '60',
        selectedInsuranceId: 'no',
        selectedSlaLevel: 'Brons',
        selectedDriftpaket: 'Bas',
        leaseAdjustmentFactor: 0.5,
        useFlatrateOption: 'perCredit',
        currentSliderStep: 1,
        selectedLeasingModel: 'grundleasing',
        workDaysPerMonth: 22
      }
    }
  ];
  
  console.log(`\n📋 Kör ${quickTests.length} snabbtester...`);
  
  const results = [];
  let successCount = 0;
  
  for (const test of quickTests) {
    try {
      console.log(`\n🔧 Testar: ${test.name}`);
      
      const result = await CalculationEngine.calculate(test.inputs);
      
      const success = result.isValid && result.errors.length === 0;
      
      console.log(`   ${success ? '✅' : '❌'} ${test.name}`);
      console.log(`   Leasing: ${result.leasingCost} SEK/mån`);
      console.log(`   Credit: ${result.creditPrice} SEK`);
      console.log(`   Netto/mån: ${result.netResults.netPerMonthExVat} SEK`);
      console.log(`   Netto/år: ${result.netResults.netPerYearExVat} SEK`);
      
      if (!success) {
        console.log(`   Fel: ${result.errors.join(', ')}`);
      }
      
      if (success) successCount++;
      
      results.push({
        testName: test.name,
        success,
        result,
        inputs: test.inputs
      });
      
    } catch (error) {
      console.log(`   ❌ KRITISKT FEL: ${error}`);
      results.push({
        testName: test.name,
        success: false,
        error: String(error),
        inputs: test.inputs
      });
    }
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const successRate = (successCount / quickTests.length) * 100;
  
  console.log(`\n🎯 === SNABB BASELINE RESULTAT ===`);
  console.log(`⏱️  Tid: ${duration}ms`);
  console.log(`📊 Totalt: ${quickTests.length} tester`);
  console.log(`✅ Lyckade: ${successCount}`);
  console.log(`❌ Misslyckade: ${quickTests.length - successCount}`);
  console.log(`📈 Framgångsgrad: ${successRate.toFixed(1)}%`);
  
  if (successRate >= 100) {
    console.log(`\n🎉 PERFEKT! Alla snabbtester lyckades - systemet är redo för omfattande baseline.`);
  } else if (successRate >= 75) {
    console.log(`\n⚠️  Mestadels bra, men några problem upptäcktes. Granska felen innan omfattande baseline.`);
  } else {
    console.log(`\n🚨 VARNING: Låg framgångsgrad! Åtgärda problem innan omfattande baseline körs.`);
  }
  
  return {
    duration,
    totalTests: quickTests.length,
    successful: successCount,
    failed: quickTests.length - successCount,
    successRate,
    results
  };
}