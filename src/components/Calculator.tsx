
import React from 'react';
import CalculatorLayout from './calculator/CalculatorLayout';
import { CalculatorProvider } from '@/context/calculator/CalculatorProvider';
import MachineGalleryContainer from './MachineGalleryContainer';

const Calculator: React.FC = () => {
  return (
    <CalculatorProvider>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <MachineGalleryContainer />
        <CalculatorLayout />
      </div>
    </CalculatorProvider>
  );
};

export default Calculator;
