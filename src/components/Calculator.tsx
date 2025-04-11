
import React from 'react';
import CalculatorLayout from './calculator/CalculatorLayout';
import { CalculatorProvider } from '@/context/CalculatorContext';

const Calculator: React.FC = () => {
  return (
    <CalculatorProvider>
      <CalculatorLayout />
    </CalculatorProvider>
  );
};

export default Calculator;
