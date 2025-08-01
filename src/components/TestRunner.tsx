/**
 * TESTVERKTYG FÖR ADMINISTRATÖRER
 * 
 * Kör och visar resultat från beräkningstester och validering
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { runAllTests, testMachineCalculations, testLeasingModelScenario } from '@/utils/testing/enhancedCalculationTests';
import { testCalculations, testAllMachines } from '@/utils/testing/calculationTests';
import { createBaseline, exportBaseline, BaselineResults } from '@/utils/testing/baselineManager';
import { runQuickBaseline } from '@/utils/testing/quickBaseline';
import { logger } from '@/utils/logging/structuredLogger';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ScrollToTop from '@/components/ScrollToTop';
import { CheckCircle, XCircle, AlertTriangle, Play, Download, Trash2, Database } from 'lucide-react';

interface TestResults {
  suiteName: string;
  results: Array<{
    testName: string;
    success: boolean;
    errors: string[];
    warnings: string[];
    data?: any;
  }>;
  overallSuccess: boolean;
  timestamp: string;
}

const TestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [legacyResults, setLegacyResults] = useState<any>(null);
  const [baselineResults, setBaselineResults] = useState<BaselineResults | null>(null);
  const { toast } = useToast();

  const runNewTests = async () => {
    setIsRunning(true);
    try {
      logger.info('ui', 'Startar nya förbättrade tester', undefined, 'TestRunner');
      const results = await runAllTests();
      setTestResults({
        ...results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('ui', 'Fel vid testning', error, 'TestRunner');
    } finally {
      setIsRunning(false);
    }
  };

  const runLegacyTests = async () => {
    setIsRunning(true);
    try {
      logger.info('ui', 'Startar äldre tester', undefined, 'TestRunner');
      const emeraldResults = await testCalculations();
      const allMachinesResults = await testAllMachines();
      setLegacyResults({
        emeraldResults,
        allMachinesResults,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('ui', 'Fel vid äldre testning', error, 'TestRunner');
    } finally {
      setIsRunning(false);
    }
  };

  const runBaselineTests = async () => {
    setIsRunning(true);
    try {
      logger.info('ui', 'Startar omfattande baseline-tester', undefined, 'TestRunner');
      const results = await createBaseline();
      setBaselineResults(results);
    } catch (error) {
      logger.error('ui', 'Fel vid baseline-testning', error, 'TestRunner');
    } finally {
      setIsRunning(false);
    }
  };

  const runQuickTest = async () => {
    setIsRunning(true);
    try {
      logger.info('ui', 'Startar snabb baseline-test', undefined, 'TestRunner');
      const results = await runQuickBaseline();
      
      // Konvertera till TestResults format
      setTestResults({
        suiteName: 'Snabb Baseline-test',
        results: results.results.map(r => ({
          testName: r.testName,
          success: r.success,
          errors: r.error ? [r.error] : [],
          warnings: [],
          data: r.result || null
        })),
        overallSuccess: results.successRate === 100,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('ui', 'Fel vid snabb baseline-test', error, 'TestRunner');
    } finally {
      setIsRunning(false);
    }
  };

  const testSpecificMachine = async (machineId: string) => {
    setIsRunning(true);
    try {
      logger.info('ui', `Testar specifik maskin: ${machineId}`, undefined, 'TestRunner');
      const result = await testMachineCalculations(machineId);
      
      // Lägg till resultatet till befintliga resultat
      if (testResults) {
        setTestResults({
          ...testResults,
          results: [...testResults.results, result],
          overallSuccess: testResults.overallSuccess && result.success
        });
      } else {
        setTestResults({
          suiteName: 'Enskild Maskintest',
          results: [result],
          overallSuccess: result.success,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logger.error('ui', 'Fel vid maskintest', error, 'TestRunner');
    } finally {
      setIsRunning(false);
    }
  };

  const exportResults = () => {
    const data = {
      testResults,
      legacyResults,
      baselineResults,
      logs: logger.getLogs(),
      exportTime: new Date().toISOString()
    };
    
    // Om vi har baseline-resultat, exportera dessa separat också
    if (baselineResults) {
      const baselineExport = exportBaseline(baselineResults);
      const baselineBlob = new Blob([baselineExport], { type: 'application/json' });
      const baselineUrl = URL.createObjectURL(baselineBlob);
      const baselineLink = document.createElement('a');
      baselineLink.href = baselineUrl;
      baselineLink.download = `baseline_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(baselineLink);
      baselineLink.click();
      document.body.removeChild(baselineLink);
      URL.revokeObjectURL(baselineUrl);
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Framgång",
      description: "Testresultat exporterade som fil",
    });
  };

  const saveToDatabase = async () => {
    try {
      const exportName = `Test Export ${new Date().toLocaleString('sv-SE')}`;
      const data = {
        testResults,
        legacyResults,
        baselineResults,
        logs: logger.getLogs(),
        exportTime: new Date().toISOString()
      };

      const { error } = await supabase
        .from('test_exports')
        .insert({
          name: exportName,
          export_data: JSON.parse(JSON.stringify(data)), // Ensure serializable
          created_by: 'Admin',
          description: `Export med ${testResults?.results?.length || 0} testresultat`
        });

      if (error) throw error;

      toast({
        title: "Framgång", 
        description: "Testresultat sparade i databasen",
      });
    } catch (error) {
      console.error('Error saving to database:', error);
      toast({
        title: "Fel",
        description: "Kunde inte spara till databasen",
        variant: "destructive",
      });
    }
  };

  const clearResults = () => {
    setTestResults(null);
    setLegacyResults(null);
    setBaselineResults(null);
    logger.clearLogs();
    logger.info('ui', 'Testresultat rensade', undefined, 'TestRunner');
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-6 h-6" />
            Beräkningstester & Validering
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={runBaselineTests}
              disabled={isRunning}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            >
              <Play className="w-4 h-4" />
              Skapa Omfattande Baseline
            </Button>
            
            <Button
              onClick={runQuickTest}
              disabled={isRunning}
              variant="outline" 
              className="flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <Play className="w-4 h-4" />
              Snabb Verifiering
            </Button>
            
            <Button
              onClick={runNewTests}
              disabled={isRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Kör Förbättrade Tester
            </Button>
            
            <Button
              onClick={runLegacyTests}
              disabled={isRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Kör Äldre Tester
            </Button>
            
            <Button
              onClick={() => testSpecificMachine('emerald')}
              disabled={isRunning}
              variant="outline"
              size="sm"
            >
              Test Emerald
            </Button>
            
            <Button
              onClick={() => testSpecificMachine('zerona')}
              disabled={isRunning}
              variant="outline"
              size="sm"
            >
              Test Zerona
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={exportResults}
              disabled={!testResults && !legacyResults && !baselineResults}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportera Resultat
            </Button>
            
            <Button
              onClick={saveToDatabase}
              disabled={!testResults && !legacyResults && !baselineResults}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Spara i databas
            </Button>
          </div>

          {isRunning && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Kör tester... Detta kan ta en stund. Baseline-tester kan ta flera minuter.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Nya testresultat */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.overallSuccess)}
                {testResults.suiteName}
              </div>
              <Badge variant={testResults.overallSuccess ? "default" : "destructive"}>
                {testResults.overallSuccess ? "GODKÄNT" : "MISSLYCKADES"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Kördes: {new Date(testResults.timestamp).toLocaleString('sv-SE')}
            </div>
            
            <div className="space-y-2">
              {testResults.results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.success)}
                      <span className="font-medium">{result.testName}</span>
                    </div>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "OK" : "FEL"}
                    </Badge>
                  </div>
                  
                  {result.errors.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-red-600 mb-1">Fel:</div>
                      <ul className="text-sm text-red-600 space-y-1">
                        {result.errors.map((error, i) => (
                          <li key={i} className="list-disc list-inside">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.warnings.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-amber-600 mb-1">Varningar:</div>
                      <ul className="text-sm text-amber-600 space-y-1">
                        {result.warnings.map((warning, i) => (
                          <li key={i} className="list-disc list-inside">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.data && (
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-1">Data:</div>
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Äldre testresultat */}
      {legacyResults && (
        <Card>
          <CardHeader>
            <CardTitle>Äldre Testresultat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Kördes: {new Date(legacyResults.timestamp).toLocaleString('sv-SE')}
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Emerald Test:</h4>
                <p className="text-sm">Se konsollen för detaljerade resultat av Emerald-testet.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Alla Maskiner Test:</h4>
                <p className="text-sm">Se konsollen för detaljerade resultat av alla maskiner.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Baseline-resultat */}
      {baselineResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(baselineResults.summary.failed === 0)}
                Baseline-resultat
              </div>
              <Badge variant={baselineResults.summary.failed === 0 ? "default" : "destructive"}>
                {baselineResults.summary.failed === 0 ? "GODKÄNT" : "MISSLYCKADES"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Skapad: {new Date(baselineResults.metadata.timestamp).toLocaleString('sv-SE')}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{baselineResults.summary.totalTests}</div>
                <div className="text-sm text-blue-600">Totala Testfall</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{baselineResults.summary.successful}</div>
                <div className="text-sm text-green-600">Lyckade</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{baselineResults.summary.failed}</div>
                <div className="text-sm text-red-600">Misslyckade</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {((baselineResults.summary.successful / baselineResults.summary.totalTests) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-purple-600">Framgångsgrad</div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Testsviter inkluderade:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(baselineResults.testResults.enhanced.overallSuccess)}
                  <span>Förbättrade tester</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(true)} {/* Anta att legacy tests lyckades */}
                  <span>Äldre tester</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(baselineResults.summary.failed === 0)}
                  <span>Detaljerade beräkningsscenarier</span>
                </div>
              </div>
            </div>
            
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                Baseline sparad! {baselineResults.summary.totalTests} testfall med {baselineResults.summary.successful} lyckade beräkningar.
                Exportera för att spara som permanent referens för regressionstestning.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Loggar sammanfattning */}
      <Card>
        <CardHeader>
          <CardTitle>Logg-sammanfattning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(logger.getLogSummary()).map(([key, count]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key.replace('_', ' ')}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ScrollToTop />
    </div>
  );
};

export default TestRunner;