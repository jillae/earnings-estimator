import React from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import BreakEvenAnalysis from './BreakEvenAnalysis';

const BreakEvenAnalysisWithProvider = () => {
  return (
    <CalculatorProvider>
      <BreakEvenAnalysis />
    </CalculatorProvider>
  );
};

export default BreakEvenAnalysisWithProvider;