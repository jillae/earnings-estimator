import React from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import ROIAnalysis from './ROIAnalysis';

const ROIAnalysisWithProvider = () => {
  return (
    <CalculatorProvider>
      <ROIAnalysis />
    </CalculatorProvider>
  );
};

export default ROIAnalysisWithProvider;