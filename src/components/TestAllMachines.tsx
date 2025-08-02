import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { machineData } from '@/data/machines';
import { CalculationEngine } from '@/utils/core/CalculationEngine';
import { formatCurrency } from '@/utils/formatUtils';

interface TestResult {
  machineName: string;
  machineId: string;
  treatmentsPerDay: number;
  customerPrice: number;
  sliderStep: number;
  
  // Resultat från CalculationEngine
  monthlyRevenueIncVat: number;
  monthlyRevenueExVat: number;
  leasingCost: number;
  operatingCostTotal: number;
  netPerMonthExVat: number;
  netPerYearExVat: number;
  
  // Beläggningsgrader
  occupancy50: number;
  occupancy75: number;
  occupancy100: number;
  
  // Metadata
  isValid: boolean;
  errors: string[];
}

const TestAllMachines: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];
    
    // Test parametrar
    const testCases = [
      { treatments: 6, price: 3000, slider: 2 }, // Standard case
      { treatments: 10, price: 1500, slider: 0 }, // Hög volym, lågt pris
      { treatments: 3, price: 5000, slider: 4 }, // Låg volym, högt pris
    ];
    
    for (const machine of machineData) {
      for (const testCase of testCases) {
        try {
          const inputs = {
            machine,
            treatmentsPerDay: testCase.treatments,
            customerPrice: testCase.price,
            paymentOption: 'leasing' as const,
            selectedLeasingPeriodId: '60',
            selectedInsuranceId: 'yes',
            selectedSlaLevel: 'Silver' as const,
            selectedDriftpaket: 'Silver' as const,
            leaseAdjustmentFactor: 1,
            useFlatrateOption: machine.usesCredits ? 'perCredit' as const : 'flatrate' as const,
            currentSliderStep: testCase.slider,
            workDaysPerMonth: 22
          };
          
          const result = await CalculationEngine.calculate(inputs);
          
          results.push({
            machineName: machine.name,
            machineId: machine.id,
            treatmentsPerDay: testCase.treatments,
            customerPrice: testCase.price,
            sliderStep: testCase.slider,
            
            monthlyRevenueIncVat: result.revenue.monthlyRevenueIncVat,
            monthlyRevenueExVat: result.revenue.monthlyRevenueExVat,
            leasingCost: result.leasingCost,
            operatingCostTotal: result.operatingCost.totalCost,
            netPerMonthExVat: result.netResults.netPerMonthExVat,
            netPerYearExVat: result.netResults.netPerYearExVat,
            
            occupancy50: result.occupancyRevenues.occupancy50,
            occupancy75: result.occupancyRevenues.occupancy75,
            occupancy100: result.occupancyRevenues.occupancy100,
            
            isValid: result.isValid,
            errors: result.errors
          });
          
        } catch (error) {
          console.error(`Test failed for ${machine.name}:`, error);
          results.push({
            machineName: machine.name,
            machineId: machine.id,
            treatmentsPerDay: testCase.treatments,
            customerPrice: testCase.price,
            sliderStep: testCase.slider,
            
            monthlyRevenueIncVat: 0,
            monthlyRevenueExVat: 0,
            leasingCost: 0,
            operatingCostTotal: 0,
            netPerMonthExVat: 0,
            netPerYearExVat: 0,
            
            occupancy50: 0,
            occupancy75: 0,
            occupancy100: 0,
            
            isValid: false,
            errors: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`]
          });
        }
      }
    }
    
    setTestResults(results);
    setIsRunning(false);
  };
  
  // Gruppera resultat per maskin
  const groupedResults = testResults.reduce((acc, result) => {
    if (!acc[result.machineId]) {
      acc[result.machineId] = [];
    }
    acc[result.machineId].push(result);
    return acc;
  }, {} as Record<string, TestResult[]>);
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Test Alla Maskiner & Variabler</h2>
        <Button onClick={runTests} disabled={isRunning}>
          {isRunning ? 'Testar...' : 'Kör Test'}
        </Button>
      </div>
      
      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Testresultat för {Object.keys(groupedResults).length} maskiner
          </h3>
          
          {Object.entries(groupedResults).map(([machineId, results]) => (
            <Card key={machineId} className="p-4">
              <h4 className="text-lg font-medium mb-3">
                {results[0].machineName}
                <Badge variant={results.every(r => r.isValid) ? "default" : "destructive"} className="ml-2">
                  {results.every(r => r.isValid) ? "✅ OK" : "❌ FEL"}
                </Badge>
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Test</th>
                      <th className="text-right p-2">Månadsintäkt</th>
                      <th className="text-right p-2">Leasing</th>
                      <th className="text-right p-2">Drift</th>
                      <th className="text-right p-2">Netto/År</th>
                      <th className="text-right p-2">50% Bel.</th>
                      <th className="text-right p-2">75% Bel.</th>
                      <th className="text-right p-2">100% Bel.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className={`border-b ${!result.isValid ? 'bg-red-50' : ''}`}>
                        <td className="p-2">
                          {result.treatmentsPerDay}×{result.customerPrice}kr (s{result.sliderStep})
                        </td>
                        <td className="text-right p-2 font-mono">
                          {formatCurrency(result.monthlyRevenueIncVat)}
                        </td>
                        <td className="text-right p-2 font-mono">
                          {formatCurrency(result.leasingCost)}
                        </td>
                        <td className="text-right p-2 font-mono">
                          {formatCurrency(result.operatingCostTotal)}
                        </td>
                        <td className="text-right p-2 font-mono font-bold">
                          {formatCurrency(result.netPerYearExVat)}
                        </td>
                        <td className="text-right p-2 font-mono">
                          {formatCurrency(result.occupancy50)}
                        </td>
                        <td className="text-right p-2 font-mono">
                          {formatCurrency(result.occupancy75)}
                        </td>
                        <td className="text-right p-2 font-mono">
                          {formatCurrency(result.occupancy100)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {results.some(r => !r.isValid) && (
                <div className="mt-2 p-2 bg-red-50 rounded">
                  <strong>Fel:</strong>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {results.filter(r => !r.isValid).map((result, index) => (
                      <li key={index}>
                        Test {result.treatmentsPerDay}×{result.customerPrice}: {result.errors.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestAllMachines;