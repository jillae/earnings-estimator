
import React from 'react';
import { CalculatorProvider } from '@/context/calculator/CalculatorProvider';
import CalculatorLayout from './calculator/CalculatorLayout';

const Calculator: React.FC = () => {
  return (
    <CalculatorProvider>
      <CalculatorLayout />
    </CalculatorProvider>
  );
};

export default Calculator;
