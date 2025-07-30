/**
 * TESTFIL FÖR ATT VERIFIERA BERÄKNINGAR
 * 
 * Använder befintliga hårdkodade värden för att testa den nya beräkningsmotorn
 */

import { CalculationEngine } from '../core/CalculationEngine';
import { machineData } from '@/data/machines';

export async function testCalculations() {
  console.log('🧪 === STARTAR TESTNING AV BERÄKNINGAR ===');
  
  // Test 1: Emerald maskin med standardvärden (från din tidigare analys)
  const emeraldMachine = machineData.find(m => m.id === 'emerald');
  
  if (!emeraldMachine) {
    console.error('❌ Kan inte hitta Emerald maskin');
    return;
  }
  
  const testInputs = {
    machine: emeraldMachine,
    treatmentsPerDay: 2, // Från din flatrate-tröskel analys
    customerPrice: emeraldMachine.defaultCustomerPrice || 3500, // Använd standard
    paymentOption: 'leasing' as const,
    selectedLeasingPeriodId: '60', // 60 månader standard
    selectedInsuranceId: 'none',
    selectedSlaLevel: 'Brons' as const,
    selectedDriftpaket: 'Bas' as const,
    leaseAdjustmentFactor: 1.0, // Standard (mitten)
    useFlatrateOption: 'perCredit' as const,
    currentSliderStep: 1, // Standard-läge
    selectedLeasingModel: 'grundleasing' as const,
    exchangeRate: 11.4926, // Standard växelkurs
    workDaysPerMonth: 22
  };
  
  console.log('📋 TESTPARAMETRAR:');
  console.log(`- Maskin: ${emeraldMachine.name}`);
  console.log(`- Pris EUR: ${emeraldMachine.priceEur}`);
  console.log(`- Behandlingar/dag: ${testInputs.treatmentsPerDay}`);
  console.log(`- Kundpris: ${testInputs.customerPrice} SEK`);
  console.log(`- Creditpris min-max: ${emeraldMachine.creditMin}-${emeraldMachine.creditMax} SEK`);
  console.log(`- Flatrate: ${emeraldMachine.flatrateAmount} SEK/månad`);
  
  try {
    const results = await CalculationEngine.calculate(testInputs);
    
    console.log('\n✅ BERÄKNINGSRESULTAT:');
    console.log('='.repeat(50));
    
    // Maskinpriser
    console.log(`💰 Maskinpris SEK: ${Math.round(results.machinePriceSEK).toLocaleString('sv-SE')} kr`);
    console.log(`💰 Kontantpris: ${Math.round(results.cashPriceSEK).toLocaleString('sv-SE')} kr`);
    
    // Leasing
    console.log(`📈 Leasingkostnad (aktiv): ${Math.round(results.leasingCost).toLocaleString('sv-SE')} kr/mån`);
    console.log(`📈 Grundkostnad (tariff): ${Math.round(results.leasingCostBase).toLocaleString('sv-SE')} kr/mån`);
    console.log(`📈 Strategisk kostnad (maskindata): ${Math.round(results.leasingCostStrategic).toLocaleString('sv-SE')} kr/mån`);
    console.log(`📈 Kompensationspåslag: ${Math.round(results.leasingCostStrategic - results.leasingCostBase).toLocaleString('sv-SE')} kr (${((results.leasingCostStrategic/results.leasingCostBase-1)*100).toFixed(1)}%)`);
    console.log(`📈 Leasing range: ${Math.round(results.leasingRange.min)}-${Math.round(results.leasingRange.max)} kr/mån`);
    console.log(`📈 Leasing 60m ref: ${Math.round(results.leasingMax60mRef).toLocaleString('sv-SE')} kr/mån`);
    
    // Credits
    console.log(`🎫 Kreditpris: ${results.creditPrice} kr/credit`);
    
    // Driftskostnader
    console.log(`⚙️ Driftskostnad: ${Math.round(results.operatingCost.costPerMonth).toLocaleString('sv-SE')} kr/mån`);
    console.log(`⚙️ Använder flatrate: ${results.operatingCost.useFlatrate ? 'Ja' : 'Nej'}`);
    console.log(`⚙️ SLA-kostnad: ${Math.round(results.operatingCost.slaCost).toLocaleString('sv-SE')} kr/mån`);
    console.log(`⚙️ Total driftskostnad: ${Math.round(results.operatingCost.totalCost).toLocaleString('sv-SE')} kr/mån`);
    
    // Intäkter
    console.log(`💵 Månadsintäkt (ink moms): ${Math.round(results.revenue.monthlyRevenueIncVat).toLocaleString('sv-SE')} kr`);
    console.log(`💵 Månadsintäkt (ex moms): ${Math.round(results.revenue.monthlyRevenueExVat).toLocaleString('sv-SE')} kr`);
    console.log(`💵 Årsintäkt (ex moms): ${Math.round(results.revenue.yearlyRevenueExVat).toLocaleString('sv-SE')} kr`);
    
    // Netto
    console.log(`🏆 Netto/månad: ${Math.round(results.netResults.netPerMonthExVat).toLocaleString('sv-SE')} kr`);
    console.log(`🏆 Netto/år: ${Math.round(results.netResults.netPerYearExVat).toLocaleString('sv-SE')} kr`);
    
    // Verifiering mot förväntade värden
    console.log('\n🔍 VALIDERING:');
    console.log('='.repeat(50));
    
    // Nu jämför vi båda värdena
    const expectedStrategicMax = emeraldMachine.leasingMax || 0;
    const actualStrategicMax = results.leasingCostStrategic;
    const actualBaseMax = results.leasingCostBase;
    
    console.log(`📊 STRATEGISK PRISSÄTTNING:`);
    console.log(`   Förväntad: ${expectedStrategicMax.toLocaleString('sv-SE')} kr (maskindata)`);
    console.log(`   Beräknad: ${Math.round(actualStrategicMax).toLocaleString('sv-SE')} kr`);
    const strategicDiff = Math.abs(expectedStrategicMax - actualStrategicMax);
    console.log(`   Skillnad: ${Math.round(strategicDiff).toLocaleString('sv-SE')} kr (${((strategicDiff/expectedStrategicMax)*100).toFixed(1)}%)`);
    
    console.log(`📊 GRUNDKOSTNAD (TARIFF):`);
    console.log(`   Beräknad: ${Math.round(actualBaseMax).toLocaleString('sv-SE')} kr`);
    console.log(`   Credit-kompensation: ${Math.round(actualStrategicMax - actualBaseMax).toLocaleString('sv-SE')} kr`);
    
    if (strategicDiff / expectedStrategicMax < 0.05) { // Mindre än 5% avvikelse
      console.log('✅ Strategisk prissättning: GODKÄND');
    } else {
      console.log('❌ Strategisk prissättning: AVVIKELSE FÖR STOR');
    }
    
    // Kontrollera credit-priser
    const isCreditsInRange = results.creditPrice >= emeraldMachine.creditMin! && 
                            results.creditPrice <= emeraldMachine.creditMax!;
    console.log(`📊 Credit-pris inom range (${emeraldMachine.creditMin}-${emeraldMachine.creditMax}): ${isCreditsInRange ? '✅ JA' : '❌ NEJ'}`);
    
    // Kontrollera rimliga intäkter (2 behandlingar/dag * 3500 kr * 22 dagar = 154,000 kr/mån ink moms)
    const expectedMonthlyRevenue = testInputs.treatmentsPerDay * testInputs.customerPrice * 22;
    const actualMonthlyRevenue = results.revenue.monthlyRevenueIncVat;
    const revenueDiff = Math.abs(expectedMonthlyRevenue - actualMonthlyRevenue);
    
    console.log(`📊 Förväntad månadsintäkt: ${expectedMonthlyRevenue.toLocaleString('sv-SE')} kr`);
    console.log(`📊 Beräknad månadsintäkt: ${Math.round(actualMonthlyRevenue).toLocaleString('sv-SE')} kr`);
    console.log(`📊 Skillnad: ${Math.round(revenueDiff).toLocaleString('sv-SE')} kr`);
    
    if (revenueDiff < 1000) { // Mindre än 1000 kr skillnad
      console.log('✅ Intäkts-beräkning: GODKÄND');
    } else {
      console.log('❌ Intäkts-beräkning: AVVIKELSE');
    }
    
    // Sammanfattning
    const isStrategicValid = strategicDiff / expectedStrategicMax < 0.05;
    const isAllValid = results.isValid && 
                      isStrategicValid && 
                      isCreditsInRange && 
                      revenueDiff < 1000;
    
    console.log('\n🎯 SLUTRESULTAT:');
    console.log('='.repeat(50));
    console.log(`${isAllValid ? '✅ ALLA TESTER GODKÄNDA' : '❌ VISSA TESTER MISSLYCKADES'}`);
    console.log(`📋 SAMMANFATTNING:`);
    console.log(`   • Strategisk prissättning använder dina hårdkodade värden med credit-kompensation`);
    console.log(`   • Grundkostnad är ren tariff-baserad finansieringskostnad`);
    console.log(`   • Skillnaden (${Math.round(actualStrategicMax - actualBaseMax)} kr) är din credit-förlust-kompensation`);
    
    if (results.errors.length > 0) {
      console.log('🚨 Fel:', results.errors);
    }
    
    if (results.warnings.length > 0) {
      console.log('⚠️ Varningar:', results.warnings);
    }
    
    return results;
    
  } catch (error) {
    console.error('💥 KRITISKT FEL VID TESTNING:', error);
    return null;
  }
}

// Test med olika maskiner
export async function testAllMachines() {
  console.log('\n🧪 === TESTAR ALLA MASKINER ===');
  
  for (const machine of machineData) {
    if (!machine.usesCredits) {
      console.log(`⏭️ Hoppar över ${machine.name} (använder inte credits)`);
      continue;
    }
    
    console.log(`\n🔧 Testar ${machine.name}...`);
    
    const testInputs = {
      machine: machine,
      treatmentsPerDay: 2,
      customerPrice: machine.defaultCustomerPrice || 1800,
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
    
    try {
      const results = await CalculationEngine.calculate(testInputs);
      
      if (results.isValid) {
        console.log(`  ✅ ${machine.name}: Leasing ${Math.round(results.leasingCost)} kr/mån, Credit ${results.creditPrice} kr, Netto ${Math.round(results.netResults.netPerMonthExVat)} kr/mån`);
      } else {
        console.log(`  ❌ ${machine.name}: FEL - ${results.errors.join(', ')}`);
      }
    } catch (error) {
      console.log(`  💥 ${machine.name}: KRITISKT FEL - ${error}`);
    }
  }
}