/**
 * TEMP KOMPONENT FÖR ATT KÖRA TESTER
 */

import React, { useEffect } from 'react';
import { testCalculations, testAllMachines } from '@/utils/testing/calculationTests';

const TestRunner: React.FC = () => {
  useEffect(() => {
    const runTests = async () => {
      // Kör huvudtest
      await testCalculations();
      
      // Kör test på alla maskiner
      await testAllMachines();
    };
    
    runTests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Kör beräkningstester</h2>
      <p>Kontrollera konsolen för testresultat...</p>
    </div>
  );
};

export default TestRunner;